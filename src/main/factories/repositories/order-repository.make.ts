import { OrderRepository } from '@/domain/repositories/order-repository.interface';
import { OrderRepositoryMongoose } from '@/data/repositories/order-repository';

export class MakeOrderRepository {
  static create(): OrderRepository {
    return new OrderRepositoryMongoose();
  }
}
