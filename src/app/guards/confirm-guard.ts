import { inject, Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { SettingsComponent } from '../components/settings/settings';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class ConfirmGuard implements CanDeactivate<SettingsComponent> {
  private readonly translate = inject(TranslateService);

  canDeactivate(target: SettingsComponent) {
    if (target.hasPendingChanges) {
      return globalThis.confirm(this.translate.instant('common.confirm-pending'));
    }
    return true;
  }
}
