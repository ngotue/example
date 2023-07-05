import { Component } from '@angular/core';

import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-component',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = null
  }

  onCloseAlert() {
    this.error = null;
  }

  onSubmit(form) {
    if (!form.valid) return;
    this.isLoading = true;
    let authObs: Observable<AuthResponseData>
    if (this.isLoginMode) {
      authObs = this.authService.login(form.value.email, form.value.password)
    } else {
      authObs = this.authService.signup(form.value.email, form.value.password)
    }
    authObs.subscribe({
        next: (data: AuthResponseData) => {
          console.log(data);
          this.isLoading = false;
            this.router.navigate(['/recipes'])
        },
        error: (error) => {
          this.error = error;
          this.isLoading = false;
        },
        complete: console.log,
      })
  }
}
