import { SearchOrdersUseCase } from '../../domain/useCases/search-orders.usecase.interface';
import {
  OrderRepository,
  OrderDocument,
} from '../../domain/repositories/order-repository.interface';
import { UserDto } from '../../presentation/dto/order.dto';
import { OrderAggregationService } from '../../domain/services/order-aggregation.service.interface';

export class SearchOrdersUseCaseImpl implements SearchOrdersUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderAggregationService: OrderAggregationService,
  ) {}

  async execute(query: Record<string, unknown>): Promise<UserDto[]> {
    try {
      console.log('SearchOrdersUseCase - Query received:', query);

      const allowedParams = [
        'order_id',
        'user_id',
        'start',
        'end',
        'page',
        'all',
      ];
      const queryKeys = Object.keys(query);
      const invalidParams = queryKeys.filter((k) => !allowedParams.includes(k));
      if (invalidParams.length > 0) {
        throw new Error(
          `Parâmetro(s) não permitido(s): ${invalidParams.join(', ')}`,
        );
      }
      const { order_id, user_id, start, end, page, all } = query;
      const filter: Record<string, unknown> = {};
      if (order_id !== undefined) {
        if (!/^[0-9]+$/.test(String(order_id))) {
          throw new Error('order_id deve ser um número inteiro');
        }
        filter.order_id = Number(order_id);
      }
      if (user_id !== undefined) {
        if (!/^[0-9]+$/.test(String(user_id))) {
          throw new Error('user_id deve ser um número inteiro');
        }
        filter.user_id = Number(user_id);
      }
      let applyDateFilter = true;
      if (order_id !== undefined || user_id !== undefined) {
        applyDateFilter = false;
      }
      let startDate = start ? String(start) : undefined;
      let endDate = end ? String(end) : undefined;
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      if (startDate && !endDate) {
        endDate = todayStr;
      }
      if (!startDate && endDate) {
        startDate = '0000-01-01';
      }
      if (startDate && endDate && applyDateFilter) {
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(endDate)
        ) {
          throw new Error('Datas devem estar no formato YYYY-MM-DD');
        }
        if (startDate > endDate) {
          const temp = startDate;
          startDate = endDate;
          endDate = temp;
        }
        filter.date = { $gte: startDate, $lte: endDate };
      }
      const pageNumber = Number(page) || 1;
      const limitNumber = 100;
      const skip = (pageNumber - 1) * limitNumber;

      console.log('SearchOrdersUseCase - Filter:', filter);
      console.log('SearchOrdersUseCase - Skip:', skip, 'Limit:', limitNumber);

      const totalItems = await this.orderRepository.countDocuments(filter);
      console.log('SearchOrdersUseCase - Total items:', totalItems);

      const totalPages = Math.ceil(totalItems / limitNumber) || 1;
      const docs: OrderDocument[] =
        all === 'true'
          ? await this.orderRepository.find(filter)
          : await this.orderRepository.find(filter, {
              skip,
              limit: limitNumber,
            });

      console.log('SearchOrdersUseCase - Documents found:', docs.length);

      const result = this.orderAggregationService.groupAndSum(docs);
      console.log('SearchOrdersUseCase - Aggregated result:', result.length);

      return result;
    } catch (error) {
      console.error('SearchOrdersUseCase - Error:', error);
      throw error;
    }
  }
}
