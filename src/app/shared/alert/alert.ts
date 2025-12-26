import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Alert } from '../../models/alert';
import { AlertService } from '../../services/alertService';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class AlertComponent implements OnInit, OnDestroy {
  private alertService = inject(AlertService);

  data = input.required<Alert>();
  isClosing = signal(false);

  private autoCloseTimerId: number | undefined;
  private fadeTimerId: number | undefined;

  private static readonly AUTO_CLOSE_MS = 5000;
  private static readonly FADE_OUT_MS = 300;

  ngOnInit() {
    this.autoCloseTimerId = window.setTimeout(
      () => this.startClose(),
      AlertComponent.AUTO_CLOSE_MS
    );
  }

  ngOnDestroy() {
    window.clearTimeout(this.autoCloseTimerId);
    window.clearTimeout(this.fadeTimerId);
  }

  onCloseAlert() {
    this.startClose();
  }

  get alertClass() {
    const baseClass = 'alert alert-dismissible fade';
    const showClass = this.isClosing() ? '' : ' show';
    if (this.data().type === 'error') {
      return baseClass + showClass + ' alert-danger';
    } else {
      return baseClass + showClass + ' alert-success';
    }
  }

  private startClose() {
    if (this.isClosing()) return;
    this.isClosing.set(true);
    this.fadeTimerId = window.setTimeout(() => {
      this.alertService.closeAlert(this.data().id);
    }, AlertComponent.FADE_OUT_MS);
  }
}
