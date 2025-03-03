import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Keep your existing zone optimization
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Keep router config
    provideRouter(routes),
    
    // Add HTTP support
    provideHttpClient()
  ]
};