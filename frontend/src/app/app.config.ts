import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAuth } from 'angular-auth-oidc-client';   // <-- correct import
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SCHEDULER_CONFIG, SchedulerConfig, DefaultSchedulerTranslationService } from 'scheduler-lib';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { authConfig, environment } from '../environments/environment';

// Factory function for TranslateHttpLoader
export function httpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimations(),
    provideAuth({
      config: authConfig
    }),
    // Scheduler Library Configuration
    {
      provide: SCHEDULER_CONFIG,
      useValue: {
        apiUrl: environment.apiUrl + '/scheduler', // Update this to your actual API URL
        translation: {
          useExistingTranslation: true,
        },
        theme: {
          useExistingTheme: true
        },
        features: {
          jobs: true,
          triggers: true,
          executionHistory: true,
          executingJobs: true
        }
      } as SchedulerConfig
    },
    provideTranslateService({
      defaultLanguage: 'en',
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    // // Override the default scheduler translation service to use your existing ngx-translate
    {
      provide: DefaultSchedulerTranslationService,
      useFactory: (translateService: TranslateService) => {
        return {
          instant: (key: string, params?: any) => {
            return translateService.instant(`${key}`, params) || key;
          },
          get: (key: string, params?: any) => {
            return translateService.get(`${key}`, params);
          }
        };
      },
      deps: [TranslateService]
    }
  ]
};