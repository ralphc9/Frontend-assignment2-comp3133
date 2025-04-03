// src/app/app.config.ts
import { ApplicationConfig, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { environment } from '../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { provideServerRendering } from '@angular/platform-server';

export function createApollo(httpLink: HttpLink, platformId: Object) {
  const http = httpLink.create({
    uri: environment.apiUrl,
  });

  const auth = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists
    const isBrowser = isPlatformBrowser(platformId);
    
    let token = null;
    if (isBrowser) {
      token = localStorage.getItem('token');
    }
    
    // Return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    };
  });

  return {
    cache: new InMemoryCache(),
    link: auth.concat(http),
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideRouter(routes),
    provideHttpClient(),
    Apollo,
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, PLATFORM_ID],
    }
  ]
};