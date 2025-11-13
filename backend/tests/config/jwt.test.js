const path = require('path');

describe('getJwtSecret', () => {
  const ORIGINAL_SECRET = process.env.JWT_SECRET;
  let getJwtSecret;

  afterEach(() => {
    jest.resetModules();
    if (ORIGINAL_SECRET === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = ORIGINAL_SECRET;
    }
  });

  test('returns the JWT secret when set', () => {
    process.env.JWT_SECRET = 'unit-test-secret';
    getJwtSecret = require('../../src/config/jwt').getJwtSecret;

    expect(getJwtSecret()).toBe('unit-test-secret');
  });

  test('throws an error when JWT secret is missing', () => {
    delete process.env.JWT_SECRET;
    const modulePath = path.resolve(__dirname, '../../src/config/jwt');

    expect(() => {
      jest.isolateModules(() => {
        require(modulePath).getJwtSecret();
      });
    }).toThrow('JWT_SECRET environment variable is not set');
  });
});

