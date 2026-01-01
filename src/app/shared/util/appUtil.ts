import { HttpErrorResponse } from '@angular/common/http';

export function translateErrorMessage(resp: HttpErrorResponse): string {
  // Doesnt contain error message from server, return as unkown
  if (!resp?.error?.message) {
    return 'Unkown error';
  }

  // Translate invalid data
  if (resp.status === 400) {
    let message = resp.error.message;

    if (resp.error.errors) {
      message = message + ': ' + resp.error.errors.join(';');
    }

    return message;
  }

  return resp.error.message;
}
