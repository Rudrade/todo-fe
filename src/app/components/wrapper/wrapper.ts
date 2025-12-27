import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu';
import { AlertService } from '../../services/alertService';
import { AlertComponent } from '../../shared/alert/alert';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.html',
  styleUrls: ['./wrapper.css'],
  imports: [RouterOutlet, MenuComponent, AlertComponent],
})
export class WrapperComponent {
  private readonly alertService = inject(AlertService);

  alerts = this.alertService.allAlerts;
}
