import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showRemoteSetting = environment.showRemoteSetting;
  languages = [
    {
      display: 'English',
      code: 'en-US',
    },
    {
      display: '简体中文',
      code: 'zh-CN',
    },
  ];

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'github',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/github-mark-white.svg',
      ),
    );
  }

  activateLanguage(languageCode: string) {
    localStorage.setItem('rwa-language', languageCode);
    const hashtag = window.location.hash;
    const newUrl = new URL(
      `../${languageCode}/${hashtag}`,
      window.location.href,
    );
    window.location.href = newUrl.href;
  }
}
