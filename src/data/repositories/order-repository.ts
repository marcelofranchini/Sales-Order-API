import mongoose from 'mongoose';
import { OrderRepository } from '../../domain/repositories/order-repository.interface';
import { OrderDocument } from '../../domain/repositories/order-repository.interface';

const OrderSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  name: { type: String, required: true },
  order_id: { type: Number, required: true },
  product_id: { type: Number, required: true },
  product_value: { type: String, required: true },
  date: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

OrderSchema.index(
  {
    user_id: 1,
    name: 1,
    order_id: 1,
    product_id: 1,
    product_value: 1,
    date: 1,
  },
  { unique: true, name: 'unique_all_fields' },
);

const OrderModel = mongoose.model('Order', OrderSchema);

export class OrderRepositoryMongoose implements OrderRepository {
  async insertMany(
    orders: OrderDocument[],
    options?: { ordered?: boolean },
  ): Promise<OrderDocument[]> {
    return OrderModel.insertMany(orders, options ?? {}) as Promise<
      OrderDocument[]
    >;
  }

  async find(
    filter: Record<string, unknown>,
    options?: { skip?: number; limit?: number },
  ): Promise<OrderDocument[]> {
    return OrderModel.find(filter, null, options);
  }

  async countDocuments(filter: Record<string, unknown>): Promise<number> {
    return OrderModel.countDocuments(filter);
  }

  async dropIndex(indexName: string): Promise<void> {
    await OrderModel.collection.dropIndex(indexName);
  }
}
