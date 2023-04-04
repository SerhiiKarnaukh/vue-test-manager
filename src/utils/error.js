const ERROR_CODES = {
  EMAIL_NOT_FOUND: 'User with this email was not found',
  INVALID_PASSWORD: 'Wrong password',
  EMAIL_EXISTS: 'The email address is already in use by another account.',
  OPERATION_NOT_ALLOWED: 'Password sign-in is disabled for this project.',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'We have blocked all requests from this device due to unusual activity. Try again later.',
  auth: 'Please login'
}

export function error(code) {
  return ERROR_CODES[code] ? ERROR_CODES[code] : 'Unknown error'
}
