import {
  OrderRepository,
  OrderDocument,
} from '@/domain/repositories/order-repository.interface';
import { OrderAggregationService } from '@/domain/services/order-aggregation.service.interface';
import { UploadOrdersUseCase } from '@/domain/useCases/upload-orders.usecase.interface';
import { UploadOrdersResponseDto } from '@/presentation/dto/order.dto';

interface ProcessedLine {
  user_id: number;
  name: string;
  order_id: number;
  product_id: number;
  product_value: string;
  date: string;
  created_at: Date;
  updated_at: Date;
}

export class UploadOrdersUseCaseImpl implements UploadOrdersUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderAggregationService: OrderAggregationService,
  ) {}

  async execute(file: Express.Multer.File): Promise<UploadOrdersResponseDto> {
    if (!file) {
      throw new Error('Nenhum arquivo foi enviado');
    }
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'txt') {
      throw new Error('Apenas arquivos TXT são permitidos');
    }
    const processLine = (line: string): ProcessedLine => {
      let position = 0;
      const userId = parseInt(line.substring(position, position + 10));
      position += 10;
      const name = line.substring(position, position + 45).trim();
      position += 45;
      const orderId = parseInt(line.substring(position, position + 10));
      position += 10;
      const productId = parseInt(line.substring(position, position + 10));
      position += 10;
      const productValue =
        parseFloat(line.substring(position, position + 12)) / 100;
      position += 12;
      const dateStr = line.substring(position, position + 8);
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const date = `${year}-${month}-${day}`;
      return {
        user_id: userId,
        name,
        order_id: orderId,
        product_id: productId,
        product_value: productValue.toFixed(2),
        date,
        created_at: new Date(),
        updated_at: new Date(),
      };
    };
    const documents: OrderDocument[] = [];
    let lineCount = 0;
    for (const line of file.buffer.toString().split('\n')) {
      if (line.trim() === '') continue;
      lineCount++;
      documents.push(processLine(line) as unknown as OrderDocument);
    }
    try {
      await this.orderRepository.dropIndex('user_id_1_order_id_1_product_id_1');
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'codeName' in err &&
        (err as { codeName: string }).codeName !== 'IndexNotFound'
      ) {
        throw err;
      }
    }
    const batchSize = 2000;
    let savedOrders = 0;
    let skippedOrders = 0;
    const saveBatch = async (batch: OrderDocument[]): Promise<number> => {
      if (batch.length === 0) return 0;
      try {
        const result = await this.orderRepository.insertMany(batch, {
          ordered: false,
        });
        return result.length;
      } catch (err: unknown) {
        if (
          typeof err === 'object' &&
          err !== null &&
          'code' in err &&
          (err as { code: number }).code === 11000
        ) {
          console.warn('Registros duplicados encontrados, ignorando...');
          return 0;
        }
        console.warn('Erro ao inserir lote:', err);
        return 0;
      }
    };
    const maxConcurrentBatches = 5;
    const batches: OrderDocument[][] = [];
    for (let i = 0; i < documents.length; i += batchSize) {
      batches.push(documents.slice(i, i + batchSize));
    }
    for (let i = 0; i < batches.length; i += maxConcurrentBatches) {
      const currentBatches = batches.slice(i, i + maxConcurrentBatches);
      const promises = currentBatches.map((batch) => saveBatch(batch));
      const results = await Promise.all(promises);
      const batchInserted = results.reduce((sum, count) => sum + count, 0);
      savedOrders += batchInserted;
    }
    skippedOrders = documents.length - savedOrders;
    const groupedData = this.orderAggregationService.groupAndSum(documents);
    return {
      message: 'Arquivo TXT processado e salvo no MongoDB com sucesso',
      fileName: file.originalname,
      fileSize: file.size,
      lines: lineCount,
      savedOrders,
      skippedOrders,
      data: groupedData,
    };
  }
}
