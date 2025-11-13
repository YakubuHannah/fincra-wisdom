const ORIGINAL_SECRET = process.env.JWT_SECRET;
const TEST_SECRET = 'test-secret';

process.env.JWT_SECRET = TEST_SECRET;

const jwt = require('jsonwebtoken');
const { isAuthenticated, isAdmin } = require('../../src/middleware/auth');
const { getJwtSecret } = require('../../src/config/jwt');

const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

afterAll(() => {
  if (ORIGINAL_SECRET === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = ORIGINAL_SECRET;
  }
});

describe('isAuthenticated middleware', () => {
  test('responds with 401 when token is missing', () => {
    const req = { cookies: {}, headers: {} };
    const res = buildRes();
    const next = jest.fn();

    isAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('sets req.user and calls next for valid bearer token', () => {
    const token = jwt.sign(
      { userId: '123', email: 'tester@fincra.com', role: 'admin' },
      getJwtSecret(),
      { expiresIn: '1h' }
    );

    const req = {
      cookies: {},
      headers: { authorization: `Bearer ${token}` },
    };
    const res = buildRes();
    const next = jest.fn();

    isAuthenticated(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ email: 'tester@fincra.com', role: 'admin' });
  });
});

describe('isAdmin middleware', () => {
  test('responds with 403 when user role is not admin', () => {
    const token = jwt.sign(
      { userId: '123', email: 'tester@fincra.com', role: 'user' },
      getJwtSecret(),
      { expiresIn: '1h' }
    );

    const req = {
      cookies: {},
      headers: { authorization: `Bearer ${token}` },
    };
    const res = buildRes();
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next when role is admin', () => {
    const token = jwt.sign(
      { userId: '123', email: 'tester@fincra.com', role: 'admin' },
      getJwtSecret(),
      { expiresIn: '1h' }
    );

    const req = {
      cookies: {},
      headers: { authorization: `Bearer ${token}` },
    };
    const res = buildRes();
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

