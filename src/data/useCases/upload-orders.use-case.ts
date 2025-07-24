import { Readable } from 'stream';
import {
  OrderRepository,
  OrderDocument,
} from '../../domain/repositories/order-repository.interface';
import { OrderAggregationService } from '../../domain/services/order-aggregation.service.interface';
import { UploadOrdersUseCase } from '../../domain/useCases/upload-orders.usecase.interface';
import { UploadOrdersResponseDto } from '../../presentation/dto/order.dto';

interface RawOrderData extends OrderDocument {
  user_id: number;
  name: string;
  order_id: number;
  product_id: number;
  product_value: string;
  date: string;
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

    const fileName = file.originalname;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    if (fileExtension !== 'txt') {
      throw new Error('Apenas arquivos TXT são permitidos');
    }

    const fileContent = file.buffer.toString('utf-8');
    const lines = fileContent.split('\n').filter((line) => line.trim());
    const fileSize = file.size;

    const orders: RawOrderData[] = [];
    let savedOrders = 0;
    let skippedOrders = 0;
    let processedLines = 0;

    let invalidLinesCount = 0;
    let emptyLinesCount = 0;
    let errorLinesCount = 0;

    const parseFixedWidthLine = (line: string): string[] => {
      if (line.length < 95) {
        return [];
      }

      const parts: string[] = [];

      parts.push(line.substring(0, 10).trim());
      parts.push(line.substring(10, 55).trim());
      parts.push(line.substring(55, 65).trim());
      parts.push(line.substring(65, 75).trim());
      parts.push(line.substring(75, 87).trim());
      parts.push(line.substring(87, 95).trim());

      return parts;
    };

    for (const line of lines) {
      processedLines++;

      if (!line.trim()) {
        emptyLinesCount++;
        continue;
      }

      let parts: string[];
      parts = parseFixedWidthLine(line);

      if (parts.length < 6) {
        invalidLinesCount++;
        continue;
      }

      const [user_id, name, order_id, product_id, product_value, date] = parts;

      try {
        if (
          !user_id ||
          !name ||
          !order_id ||
          !product_id ||
          !product_value ||
          !date
        ) {
          invalidLinesCount++;
          continue;
        }

        const userId = parseInt(user_id);
        const orderId = parseInt(order_id);
        const productId = parseInt(product_id);

        if (isNaN(userId) || isNaN(orderId) || isNaN(productId)) {
          invalidLinesCount++;
          continue;
        }

        orders.push({
          user_id: userId,
          name: name.trim(),
          order_id: orderId,
          product_id: productId,
          product_value: product_value.trim(),
          date: this.formatDate(date.trim()),
        });

        if (processedLines % 100 === 0) {
          console.log(`Processadas ${processedLines} linhas...`);
        }
      } catch (error) {
        errorLinesCount++;
      }
    }

    const batchSize = 100;
    const batches: RawOrderData[][] = [];

    for (let i = 0; i < orders.length; i += batchSize) {
      batches.push(orders.slice(i, i + batchSize));
    }

    const saveBatch = async (
      batch: RawOrderData[],
      batchIndex: number,
    ): Promise<number> => {
      try {
        await this.orderRepository.insertMany(batch, {
          ordered: false,
        });
        return batch.length;
      } catch (err: any) {
        if (err.code === 11000 || (err as { code: number }).code === 11000) {
          return 0;
        }
        return 0;
      }
    };

    const results = await Promise.all(
      batches.map((batch, index) => saveBatch(batch, index)),
    );
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

  private formatDate(dateString: string): string {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
  }
}
