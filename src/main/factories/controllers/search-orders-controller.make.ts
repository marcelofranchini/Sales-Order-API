import { SearchOrdersController } from '../../../presentation/controllers/search-orders.controller';
import { MakeSearchOrdersUseCase } from '../useCases/search-orders-use-case.make';

export class MakeSearchOrdersController {
  static create(): SearchOrdersController {
    return new SearchOrdersController(MakeSearchOrdersUseCase.create());
  }
}
