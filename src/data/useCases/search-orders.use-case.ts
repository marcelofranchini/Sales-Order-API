import {
  SearchOrdersUseCase,
  SearchOrdersResponse,
} from '../../domain/useCases/search-orders.usecase.interface';
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

  async execute(
    query: Record<string, unknown>,
  ): Promise<UserDto[] | SearchOrdersResponse> {
    try {
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
      if (startDate && endDate) {
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

      const totalItems = await this.orderRepository.countDocuments(filter);
      const limitNumber = all !== 'true' ? 100 : totalItems;
      const skip = (pageNumber - 1) * limitNumber;

      const totalPages =
        all !== 'true' ? Math.ceil(totalItems / limitNumber) || 1 : pageNumber;
      const docs: OrderDocument[] =
        all === 'true'
          ? await this.orderRepository.find(filter)
          : await this.orderRepository.find(filter, {
              skip,
              limit: limitNumber,
            });

      const result = this.orderAggregationService.groupAndSum(docs);
      const data = {
        pagination: {
          totalPages,
          currentPage: pageNumber,
          totalItems,
          itemsPerPage: limitNumber,
        },
        data: result,
      };

      return data;
    } catch (error) {
      console.error('SearchOrdersUseCase - Error:', error);
      throw error;
    }
  }
}
