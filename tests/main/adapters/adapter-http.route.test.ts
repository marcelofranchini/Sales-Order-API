import { adaptExpressRoute } from '@/infra/adapters/http-express.adpter';
import { ControllerInterface } from '@/presentation/interfaces/controller.interface';
import { HttpRequest, HttpResponse } from '@/presentation/dto/http.dto';

describe('adaptExpressRoute', () => {
  let mockController: jest.Mocked<ControllerInterface>;

  beforeEach(() => {
    mockController = {
      handle: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call controller handle method', async () => {
    const mockRequest = {
      body: {},
      params: {},
      query: {},
      headers: {},
    } as any;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const mockHttpResponse: HttpResponse = {
      statusCode: 200,
      body: { message: 'Success' },
    };

    mockController.handle.mockResolvedValue(mockHttpResponse);

    const adaptedRoute = adaptExpressRoute(mockController);

    await adaptedRoute(mockRequest, mockResponse);

    expect(mockController.handle).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Success' });
  });

  it('should handle controller errors', async () => {
    const mockRequest = {
      body: {},
      params: {},
      query: {},
      headers: {},
    } as any;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const error = new Error('Controller error');
    mockController.handle.mockRejectedValue(error);

    const adaptedRoute = adaptExpressRoute(mockController);

    await adaptedRoute(mockRequest, mockResponse);

    expect(mockController.handle).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
