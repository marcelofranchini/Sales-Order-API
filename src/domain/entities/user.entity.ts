import { Order } from './order.entity';

export interface User {
  user_id: number;
  name: string;
  orders: Order[];
}
