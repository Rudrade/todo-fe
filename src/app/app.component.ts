import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGES } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet],
})
export class App {
  private readonly translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(LANGUAGES);
    this.translate.setFallbackLang('EN');
    this.translate.use(this.fetchBrowserLanguage());
  }

  private fetchBrowserLanguage() {
    if (navigator.language.includes('PT')) return 'PT';

    return 'EN';
  }
}
