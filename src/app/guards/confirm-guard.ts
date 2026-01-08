import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { SettingsComponent } from '../components/settings/settings';

@Injectable({ providedIn: 'root' })
export class ConfirmGuard implements CanDeactivate<SettingsComponent> {
  canDeactivate(target: SettingsComponent) {
    if (target.hasPendingChanges) {
      return globalThis.confirm('You change pending changes. Are you sure you want to exit?');
    }
    return true;
  }
}
