import { UserDto } from '../../presentation/dto/order.dto';

export interface SearchOrdersResponse {
  pagination?: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  data: UserDto[];
}

export interface SearchOrdersUseCase {
  execute(
    query: Record<string, unknown>,
  ): Promise<UserDto[] | SearchOrdersResponse>;
}
