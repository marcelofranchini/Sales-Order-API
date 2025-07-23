import { HealthStatusInterface } from '@/domain/contracts/healthcheck-status.interface';

export interface HttpRequest {
  statusCode(statusCode: number): unknown;
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}

export interface HttpResponse<TBody = unknown> {
  statusCode: number;
  body: TBody;
}

export interface HealthCheckRequest {
  body?: never;
  params?: never;
  query?: never;
  headers?: Record<string, string>;
}

export interface HealthCheckResponse {
  statusCode: 200 | 500 | 503;
  body: HealthStatusInterface;
}
