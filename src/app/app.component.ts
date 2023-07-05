import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentFeature: string = 'recipe'

  constructor(private authService: AuthService){}

  onFeatureSelect(feature: string) {
    this.currentFeature = feature
  }

  ngOnInit() {
    this.authService.autoLogin()
  }
}
