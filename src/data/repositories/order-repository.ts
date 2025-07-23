import {
  OrderRepository,
  OrderDocument,
} from '@/domain/repositories/order-repository.interface';
import mongoose from 'mongoose';

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
OrderModel.createIndexes();

function hasCodeName(err: unknown): err is { codeName: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'codeName' in err &&
    typeof (err as { codeName: unknown }).codeName === 'string'
  );
}

export class OrderRepositoryMongoose implements OrderRepository {
  async insertMany(
    orders: OrderDocument[],
    options?: { ordered?: boolean },
  ): Promise<OrderDocument[]> {
    return OrderModel.insertMany(orders, options ?? {});
  }
  async find(
    filter: Record<string, unknown>,
    options?: { skip?: number; limit?: number },
  ): Promise<OrderDocument[]> {
    let query = OrderModel.find(filter);
    if (options?.skip) query = query.skip(options.skip);
    if (options?.limit) query = query.limit(options.limit);
    return query.lean();
  }
  async countDocuments(filter: Record<string, unknown>): Promise<number> {
    return OrderModel.countDocuments(filter);
  }
  async dropIndex(indexName: string): Promise<void> {
    try {
      await OrderModel.collection.dropIndex(indexName);
    } catch (err: unknown) {
      if (hasCodeName(err) && err.codeName !== 'IndexNotFound') {
        throw err;
      }
    }
  }
}
