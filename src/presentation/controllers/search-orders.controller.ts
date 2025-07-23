import { HttpRequest, HttpResponse } from '@/presentation/dto/http.dto';
import { ControllerInterface } from '@/presentation/interfaces/controller.interface';
import { SearchOrdersUseCase } from '@/domain/useCases/search-orders.usecase.interface';

export class SearchOrdersController implements ControllerInterface {
  constructor(private readonly searchOrdersUseCase: SearchOrdersUseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const query = request.query ?? {};
      const result = await this.searchOrdersUseCase.execute(
        query as Record<string, unknown>,
      );
      return {
        statusCode: 200,
        body: result,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Parâmetro(s) não permitido(s)')) {
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
