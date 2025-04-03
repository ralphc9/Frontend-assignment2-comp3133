// src/app/services/auth.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { gql } from 'apollo-angular';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private apollo: Apollo,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Check if user is already logged in - only in browser environment
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    return this.apollo.mutate<{ login: { token: string, user: User } }>({
      mutation: gql`
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            token
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: {
        username,
        password
      }
    }).pipe(
      map(result => {
        if (result.data?.login) {
          const { token, user } = result.data.login;
          
          // Store user details and token in localStorage - only in browser environment
          if (this.isBrowser) {
            localStorage.setItem('token', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          
          this.currentUserSubject.next(user);
          return user;
        }
        throw new Error('Login failed');
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  signup(username: string, email: string, password: string): Observable<User> {
    return this.apollo.mutate<{ signup: User }>({
      mutation: gql`
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(username: $username, email: $email, password: $password) {
            id
            username
            email
          }
        }
      `,
      variables: {
        username,
        email,
        password
      }
    }).pipe(
      map(result => {
        if (result.data?.signup) {
          return result.data.signup;
        }
        throw new Error('Signup failed');
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    // Remove user from localStorage - only in browser environment
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  getToken(): string | null {
    // Get token from localStorage - only in browser environment
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }
}