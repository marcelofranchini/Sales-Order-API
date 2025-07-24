import { HttpRequest, HttpResponse } from '../dto/http.dto';
import { ControllerInterface } from '../interfaces/controller.interface';
import { SearchOrdersUseCase } from '../../domain/useCases/search-orders.usecase.interface';

export class SearchOrdersController implements ControllerInterface {
  constructor(private readonly searchOrdersUseCase: SearchOrdersUseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const query = request.query ?? {};
      const result = await this.searchOrdersUseCase.execute(query);
      return {
        statusCode: 200,
        body: result,
      };
    } catch (error) {
      console.error('SearchOrdersController error:', error);
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
