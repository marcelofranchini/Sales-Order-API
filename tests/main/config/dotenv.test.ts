import { config } from 'dotenv';
import { resolve } from 'path';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

jest.mock('path', () => ({
  resolve: jest.fn(),
}));

describe('dotenv configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load environment variables from .env file', () => {
    const mockResolve = resolve as jest.MockedFunction<typeof resolve>;
    mockResolve.mockReturnValue('/path/to/.env');

    require('../../../src/main/config/dotenv');

    expect(config).toHaveBeenCalledWith({ path: '/path/to/.env' });
    expect(mockResolve).toHaveBeenCalledWith(process.cwd(), '.env');
  });

  it('should call config with correct parameters', () => {
    jest.resetModules();
    jest.clearAllMocks();

    const pathModule = require('path');
    pathModule.resolve.mockReturnValue('/test/path/.env');

    const dotenvModule = require('dotenv');
    require('../../../src/main/config/dotenv');

    expect(dotenvModule.config).toHaveBeenCalledWith({
      path: '/test/path/.env',
    });
  });
});
