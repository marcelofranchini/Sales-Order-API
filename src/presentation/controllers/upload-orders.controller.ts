import { HttpRequest, HttpResponse } from '@/presentation/dto/http.dto';
import { ControllerInterface } from '@/presentation/interfaces/controller.interface';
import { UploadOrdersUseCase } from '@/domain/useCases/upload-orders.usecase.interface';

export class UploadOrdersController implements ControllerInterface {
  constructor(private readonly uploadOrdersUseCase: UploadOrdersUseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const file = request.file;
    const result = await this.uploadOrdersUseCase.execute(file!);
    return {
      statusCode: 200,
      body: result,
    };
  }
}
