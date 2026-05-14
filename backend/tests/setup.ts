
process.env.JWT_SECRET = 'test-secret-key';
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

expect.extend({});

global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
