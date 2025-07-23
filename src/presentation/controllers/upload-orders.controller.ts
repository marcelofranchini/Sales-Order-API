import { HttpRequest, HttpResponse } from '@/presentation/dto/http.dto';
import { ControllerInterface } from '@/presentation/interfaces/controller.interface';
import { UploadOrdersUseCase } from '@/domain/useCases/upload-orders.usecase.interface';

export class UploadOrdersController implements ControllerInterface {
  constructor(private readonly uploadOrdersUseCase: UploadOrdersUseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const file = request.file;
      const result = await this.uploadOrdersUseCase.execute(file!);
      return {
        statusCode: 200,
        body: result,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('Nenhum arquivo foi enviado') ||
          error.message.includes('Apenas arquivos TXT são permitidos')
        ) {
          return {
            statusCode: 400,
            body: { error: error.message },
          };
        }
      }
      return {
        statusCode: 500,
        body: { error: 'Internal server error' },
      };
    }
  }
}
