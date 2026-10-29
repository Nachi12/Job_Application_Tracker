import { validateEmail, validatePassword, validateRequired } from '../utils/validators.js';

describe('Auth Validation & Sanitization Tests', () => {
  test('validateEmail accepts valid emails', () => {
    expect(() => validateEmail('test@example.com')).not.toThrow();
    expect(() => validateEmail('demo@hirelog.app')).not.toThrow();
  });

  test('validateEmail rejects malformed emails', () => {
    expect(() => validateEmail('not-an-email')).toThrow('Invalid email format');
    expect(() => validateEmail('')).toThrow('Invalid email format');
  });

  test('validatePassword rejects passwords without required complexity', () => {
    expect(() => validatePassword('short1!')).toThrow();
    expect(() => validatePassword('alllowercase1')).toThrow();
    expect(() => validatePassword('ALLUPPERCASE1')).toThrow();
    expect(() => validatePassword('NoNumbersHere!')).toThrow();
  });

  test('validatePassword accepts strong password', () => {
    expect(() => validatePassword('Password123!')).not.toThrow();
    expect(() => validatePassword('SecurePass1')).not.toThrow();
  });

  test('validateRequired checks all required fields', () => {
    expect(() => validateRequired(['email', 'password'], { email: 'a@b.com', password: '123' })).not.toThrow();
    expect(() => validateRequired(['name', 'email'], { email: 'a@b.com' })).toThrow('Missing required fields: name');
  });
});

