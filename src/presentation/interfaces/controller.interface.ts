import { HttpRequest, HttpResponse } from '@/presentation/dto/http.dto';

export interface ControllerInterface<
  TRequest = HttpRequest,
  TResponse = HttpResponse,
> {
  handle(request: TRequest): Promise<TResponse>;
}
