import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const errors = {
  EMAIL_EXISTS: 'The email address is already in use by another account.',
  OPERATION_NOT_ALLOWED: 'Password sign-in is disabled for this project.',
  TOO_MANY_ATTEMPTS_TRY_LATER:
    'We have blocked all requests from this device due to unusual activity. Try again later.',
  INVALID_EMAIL: 'Your email is invalid.',
  EMAIL_NOT_FOUND:
    'There is no user record corresponding to this identifier. The user may have been deleted.',
  INVALID_PASSWORD:
    'The password is invalid or the user does not have a password.',
  USER_DISABLED: 'The user account has been disabled by an administrator.',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpirationTimer: any
  constructor(private http: HttpClient) {}

  user = new BehaviorSubject<User>(null);

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBZDP52Xtv3vnKoCZOskbGtY2kFza-yC7g',
        { email, password, returnSecureToken: true }
      )
      .pipe(catchError(this.errorHandler));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBZDP52Xtv3vnKoCZOskbGtY2kFza-yC7g',
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.errorHandler),
        tap((resData) => {
          this.authenticationHandler(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer)
    this.tokenExpirationTimer = null
  }

  authenticationHandler(
    email: string,
    id: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    this.autoLogout(expiresIn*1000)
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    console.log(loadedUser)
    if(loadedUser.token) {
      this.user.next(loadedUser)
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      this.autoLogout(expirationDuration)
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout()
    }, expirationDuration)
  }

  errorHandler(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error has occurred !';
    console.log(errorRes);
    if (
      errorRes.error ||
      errorRes.error.error ||
      errors[errorRes.error.error.message]
    )
      errorMessage = errors[errorRes.error.error.message];
    return throwError(() => new Error(errorMessage));
  }
}
