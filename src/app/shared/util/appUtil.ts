import { HttpErrorResponse } from '@angular/common/http';

export function translateErrorMessage(resp: HttpErrorResponse): string {
  // Translate invalid data
  if (resp.status === 400 && resp.error.message) {
    let message = resp.error.message;

    if (resp.error.errors) {
      message = message + ': ' + resp.error.errors.join(';');
    }

    return message;
  } else if (resp.status === 403) {
    return 'Invalid Access';
  } else if (resp.status === 415) {
    return 'Unsupported Media Type';
  }

  return resp.error.message || 'Unkown error';
}
