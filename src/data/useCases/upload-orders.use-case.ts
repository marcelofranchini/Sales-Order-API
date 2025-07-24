import { Readable } from 'stream';
import { OrderRepository } from '../../domain/repositories/order-repository.interface';
import { OrderAggregationService } from '../../domain/services/order-aggregation.service.interface';
import { UploadOrdersUseCase } from '../../domain/useCases/upload-orders.usecase.interface';
import { UploadOrdersResponseDto } from '../../presentation/dto/order.dto';

export class UploadOrdersUseCaseImpl implements UploadOrdersUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderAggregationService: OrderAggregationService,
  ) {}

  async execute(file: Express.Multer.File): Promise<UploadOrdersResponseDto> {
    if (!file) {
      throw new Error('Nenhum arquivo foi enviado');
    }

    const fileName = file.originalname;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    if (fileExtension !== 'txt') {
      throw new Error('Apenas arquivos TXT são permitidos');
    }

    const fileContent = file.buffer.toString('utf-8');
    const lines = fileContent.split('\n').filter((line) => line.trim());
    const fileSize = file.size;

    const orders: any[] = [];
    let savedOrders = 0;
    let skippedOrders = 0;

    for (const line of lines) {
      if (!line.trim()) continue;

      const parts = line.split('\t');
      if (parts.length < 6) continue;

      const [user_id, name, order_id, product_id, product_value, date] = parts;

      orders.push({
        user_id: parseInt(user_id),
        name: name.trim(),
        order_id: parseInt(order_id),
        product_id: parseInt(product_id),
        product_value: product_value.trim(),
        date: date.trim(),
      });
    }

    const batchSize = 100;
    const batches = [];

    for (let i = 0; i < orders.length; i += batchSize) {
      batches.push(orders.slice(i, i + batchSize));
    }

    const saveBatch = async (batch: any[]) => {
      try {
        await this.orderRepository.insertMany(batch, { ordered: false });
        return batch.length;
      } catch (err: any) {
        if (err.code === 11000 || (err as { code: number }).code === 11000) {
          console.warn('Registros duplicados encontrados, ignorando...');
          return 0;
        }
        console.warn('Erro ao inserir lote:', err);
        return 0;
      }
    };

    const results = await Promise.all(batches.map(saveBatch));
    savedOrders = results.reduce((sum, count) => sum + count, 0);
    skippedOrders = orders.length - savedOrders;

    const aggregatedData = this.orderAggregationService.groupAndSum(orders);

    return {
      message: 'Arquivo TXT processado e salvo no MongoDB com sucesso',
      fileName,
      fileSize,
      lines: lines.length,
      data: aggregatedData,
      savedOrders,
      skippedOrders,
    };
  }
}
