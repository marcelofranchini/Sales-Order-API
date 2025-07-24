import { UserDto } from '../../presentation/dto/order.dto';

export interface SearchOrdersUseCase {
  execute(query: Record<string, unknown>): Promise<UserDto[]>;
}
