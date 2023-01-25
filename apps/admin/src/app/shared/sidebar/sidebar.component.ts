/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { AuthService } from '@ng-shops/users';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}

  logoutUser() {
    this.authService.logout();
  }
}
