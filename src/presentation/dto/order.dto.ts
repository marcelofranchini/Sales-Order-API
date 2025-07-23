export interface ProductDto {
  product_id: number;
  value: string;
}

export interface OrderDto {
  order_id: number;
  total: string;
  date: string;
  products: ProductDto[];
}

export interface UserDto {
  user_id: number;
  name: string;
  orders: OrderDto[];
}

export interface UploadOrdersResponseDto {
  message: string;
  fileName: string;
  fileSize: number;
  lines: number;
  data: UserDto[];
  savedOrders: number;
  skippedOrders: number;
}
