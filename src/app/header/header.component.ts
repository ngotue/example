import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  userSub: Subscription
  isAuthenticated = false

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user
    })
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout()
    this.router.navigate(['auth'])
  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
  }
}
