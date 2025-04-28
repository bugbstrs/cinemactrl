import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule, RouterLink, RouterModule, AvatarModule, MenuModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  items: MenuItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.updateMenuItems();
    });
    
    this.updateMenuItems();
  }
  
  updateMenuItems() {
    const baseItems = [
      {
        label: 'My Reservations',
        icon: 'pi pi-ticket',
        routerLink: '/reservations'
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
    
    // Add admin menu items if user is admin
    if (this.currentUser?.role === 'admin') {
      this.items = [
        {
          label: 'Admin',
          icon: 'pi pi-cog',
          items: [
            {
              label: 'Manage Movies',
              icon: 'pi pi-ticket',
              routerLink: '/movies'
            },
            {
              label: 'Manage Theaters',
              icon: 'pi pi-building',
              routerLink: '/admin/theaters'
            },
            {
              label: 'Manage Showings',
              icon: 'pi pi-calendar',
              routerLink: '/showings'
            },
            ...baseItems
          ]
        },
      ];
    } else {
      this.items = baseItems;
    }
  }
  
  logout() {
    this.authService.logout();
  }
}
