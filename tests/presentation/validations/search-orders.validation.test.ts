import { SearchOrdersValidation } from '../../../src/presentation/validations/search-orders.validation';
import { Request } from 'express';

describe('SearchOrdersValidation', () => {
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    mockRequest = {
      query: {},
    };
  });

  describe('validate', () => {
    it('should pass validation with valid parameters', () => {
      mockRequest.query = {
        user_id: '1',
        page: '1',
      };

      expect(() => {
        SearchOrdersValidation.validate(mockRequest as Request);
      }).not.toThrow();
    });

    it('should pass validation with empty query', () => {
      mockRequest.query = {};

      expect(() => {
        SearchOrdersValidation.validate(mockRequest as Request);
      }).not.toThrow();
    });

    it('should pass validation with all allowed parameters', () => {
      mockRequest.query = {
        order_id: '1',
        user_id: '2',
        start: '2024-01-01',
        end: '2024-01-31',
        page: '1',
        all: 'true',
      };

      expect(() => {
        SearchOrdersValidation.validate(mockRequest as Request);
      }).not.toThrow();
    });

    it('should throw error for invalid parameters', () => {
      mockRequest.query = {
        invalid_param: 'value',
        user_id: '1',
      };

      expect(() => {
        SearchOrdersValidation.validate(mockRequest as Request);
      }).toThrow('Parâmetro(s) não permitido(s): invalid_param');
    });

    it('should throw error for multiple invalid parameters', () => {
      mockRequest.query = {
        invalid_param1: 'value1',
        invalid_param2: 'value2',
        user_id: '1',
      };

      expect(() => {
        SearchOrdersValidation.validate(mockRequest as Request);
      }).toThrow(
        'Parâmetro(s) não permitido(s): invalid_param1, invalid_param2',
      );
    });

    it('should throw error for non-numeric order_id', () => {
      mockRequest.query = {
        order_id: 'abc',
      };

      expect(() => {
        SearchOrdersValidation.validate(mockRequest as Request);
      }).toThrow('order_id deve ser um número inteiro');
    });

    it('should throw error for non-numeric user_id', () => {
      mockRequest.query = {
        user_id: 'xyz',
      };

      expect(() => {
        SearchOrdersValidation.validate(mockRequest as Request);
      }).toThrow('user_id deve ser um número inteiro');
    });

    it('should throw error for invalid start date format', () => {
      mockRequest.query = {
        start: '2024-1-1',
      };

      expect(() => {
        SearchOrdersValidation.validate(mockRequest as Request);
      }).toThrow('Data inicial deve estar no formato YYYY-MM-DD');
    });

    it('should throw error for invalid end date format', () => {
      mockRequest.query = {
        end: '2024-12-1',
      };

      expect(() => {
        SearchOrdersValidation.validate(mockRequest as Request);
      }).toThrow('Data final deve estar no formato YYYY-MM-DD');
    });

    it('should pass validation with numeric string order_id', () => {
      mockRequest.query = {
        order_id: '123',
      };

      expect(() => {
        SearchOrdersValidation.validate(mockRequest as Request);
      }).not.toThrow();
    });

    it('should pass validation with numeric string user_id', () => {
      mockRequest.query = {
        user_id: '456',
      };

      expect(() => {
        SearchOrdersValidation.validate(mockRequest as Request);
      }).not.toThrow();
    });

    it('should pass validation with correct date format', () => {
      mockRequest.query = {
        start: '2024-01-01',
        end: '2024-12-31',
      };

      expect(() => {
        SearchOrdersValidation.validate(mockRequest as Request);
      }).not.toThrow();
    });
  });
});
