import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';

import { environment } from 'src/environments/environment';

type Theme = 'light' | 'dark' | 'auto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @HostBinding('class') className = '';

  showRemoteSetting = environment.showRemoteSetting;
  showScheduledJobs = environment.electron;
  theme: Theme = 'auto';
  languages = [
    {
      display: 'English',
      code: 'en-US',
      isAI: false,
    },
    {
      display: 'Afrikaans',
      code: 'af',
      isAI: true,
    },
    {
      display: 'العربية',
      code: 'ar',
      isAI: true,
    },
    {
      display: 'Català',
      code: 'ca',
      isAI: true,
    },
    {
      display: 'Čeština',
      code: 'cs',
      isAI: true,
    },
    {
      display: 'Dansk',
      code: 'da',
      isAI: true,
    },
    {
      display: 'Deutsch',
      code: 'de-DE',
      isAI: false,
    },
    {
      display: 'Ελληνικά',
      code: 'el',
      isAI: true,
    },
    {
      display: 'Español',
      code: 'es-ES',
      isAI: true,
    },
    {
      display: 'Suomi',
      code: 'fi',
      isAI: true,
    },
    {
      display: 'Français',
      code: 'fr',
      isAI: true,
    },
    {
      display: 'עברית',
      code: 'he',
      isAI: true,
    },
    {
      display: 'Magyar',
      code: 'hu',
      isAI: true,
    },
    {
      display: 'Italiano',
      code: 'it',
      isAI: true,
    },
    {
      display: '日本語',
      code: 'ja',
      isAI: true,
    },
    {
      display: '한국어',
      code: 'ko',
      isAI: true,
    },
    {
      display: 'Nederlands',
      code: 'nl',
      isAI: true,
    },
    {
      display: 'Norsk',
      code: 'no',
      isAI: true,
    },
    {
      display: 'Polski',
      code: 'pl',
      isAI: true,
    },
    {
      display: 'Português (Brasil)',
      code: 'pt-BR',
      isAI: true,
    },
    {
      display: 'Português (Portugal)',
      code: 'pt-PT',
      isAI: true,
    },
    {
      display: 'Română',
      code: 'ro',
      isAI: true,
    },
    {
      display: 'Русский',
      code: 'ru',
      isAI: true,
    },
    {
      display: 'Српски',
      code: 'sr',
      isAI: true,
    },
    {
      display: 'Svenska',
      code: 'sv-SE',
      isAI: true,
    },
    {
      display: 'Türkçe',
      code: 'tr-TR',
      isAI: false,
    },
    {
      display: 'Українська',
      code: 'uk',
      isAI: true,
    },
    {
      display: 'Tiếng Việt',
      code: 'vi',
      isAI: true,
    },
    {
      display: '简体中文',
      code: 'zh-CN',
      isAI: false,
    },
    {
      display: '繁體中文',
      code: 'zh-TW',
      isAI: true,
    },
  ];

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private overlay: OverlayContainer,
  ) {
    iconRegistry.addSvgIcon(
      'github',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/github-mark-white.svg',
      ),
    );
  }

  ngOnInit(): void {
    const theme = (localStorage.getItem('rwa-theme') as Theme) || 'auto';
    this.activateThemeSetting(theme);
  }

  activateThemeSetting(theme: Theme) {
    localStorage.setItem('rwa-theme', theme);
    this.theme = theme;
    if (theme === 'light') {
      this.activeLightTheme();
    } else if (theme === 'dark') {
      this.activeDarkTheme();
    } else if (theme === 'auto') {
      if (this.getBrowserPreferDarkTheme()) {
        this.activeDarkTheme();
      } else {
        this.activeLightTheme();
      }
    }
  }

  getBrowserPreferDarkTheme() {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return darkQuery.matches;
  }

  activeDarkTheme() {
    this.className = 'dark-theme dark-theme-basic';
    this.overlay.getContainerElement().classList.add('dark-theme');
  }

  activeLightTheme() {
    this.className = '';
    this.overlay.getContainerElement().classList.remove('dark-theme');
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
