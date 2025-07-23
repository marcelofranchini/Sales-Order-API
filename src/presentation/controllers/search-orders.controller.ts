import { HttpRequest, HttpResponse } from '@/presentation/dto/http.dto';
import { ControllerInterface } from '@/presentation/interfaces/controller.interface';
import { SearchOrdersUseCase } from '@/domain/useCases/search-orders.usecase.interface';

export class SearchOrdersController implements ControllerInterface {
  constructor(private readonly searchOrdersUseCase: SearchOrdersUseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const query = request.query ?? {};
    const result = await this.searchOrdersUseCase.execute(
      query as Record<string, unknown>,
    );
    return {
      statusCode: 200,
      body: result,
    };
  }
}
