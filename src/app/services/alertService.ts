import { Injectable, signal } from '@angular/core';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alerts = signal<Alert[]>([]);
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

  closeAlert(id: string) {
    this.alerts.update((prev) => prev.filter((alert) => alert.id !== id));
    console.log('[CloseAlert]', this.alerts());
  }
}
