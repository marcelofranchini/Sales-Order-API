import { Document } from 'mongoose';

export type OrderDocument = Record<string, unknown>;

export interface OrderRepository {
  insertMany(
    orders: OrderDocument[],
    options?: { ordered?: boolean },
  ): Promise<OrderDocument[]>;
  find(
    filter: Record<string, unknown>,
    options?: { skip?: number; limit?: number },
  ): Promise<OrderDocument[]>;
  countDocuments(filter: Record<string, unknown>): Promise<number>;
  dropIndex(indexName: string): Promise<void>;
}
