import { validateEmail, validatePassword } from '../utils/validators.js';
import { ApiError } from '../utils/ApiError.js';

describe('validators', () => {
  test('validateEmail throws on invalid email', () => {
    expect(() => validateEmail('not-an-email')).toThrow(ApiError);
  });

  test('validatePassword enforces strength', () => {
    expect(() => validatePassword('weak')).toThrow(ApiError);
    expect(() => validatePassword('Strong123')).not.toThrow();
  });
});
