import { Component, EventEmitter, inject, input, output } from '@angular/core';
import { Alert } from '../../models/alert';
import { AlertService } from '../../services/alertService';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class AlertComponent {
  private alertService = inject(AlertService);

  data = input.required<Alert>();

  onCloseAlert() {
    this.alertService.closeAlert(this.data().id);
  }

  get alertClass() {
    const baseClass = 'alert alert-dismissible fade show';
    if (this.data().type === 'error') {
      return baseClass + ' alert-danger';
    } else {
      return baseClass + ' alert-success';
    }
  }
}
