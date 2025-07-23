import { UploadOrdersResponseDto } from '@/presentation/dto/order.dto';

export interface UploadOrdersUseCase {
  execute(file: Express.Multer.File): Promise<UploadOrdersResponseDto>;
}
