import { HttpRequest, HttpResponse } from '../dto/http.dto';

export interface ControllerInterface {
  handle(request: HttpRequest): Promise<HttpResponse>;
}
