import { Injectable, signal } from '@angular/core';
import { Alert } from '../models/alert';
import { translateErrorMessage } from '../shared/util/appUtil';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly alerts = signal<Alert[]>([]);
  allAlerts = this.alerts.asReadonly();

  addAlert(type: 'error' | 'success', message: string) {
    this.alerts.update((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        message,
      },
    ]);
    console.log('[AddAlert]', this.alerts());
  }

  addErrorAlert(res: HttpErrorResponse) {
    this.addAlert('error', translateErrorMessage(res));
  }

  closeAlert(id: string) {
    this.alerts.update((prev) => prev.filter((alert) => alert.id !== id));
    console.log('[CloseAlert]', this.alerts());
  }

  clearAllAlerts() {
    this.alerts.set([]);
  }
}
