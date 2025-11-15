import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from '../../core/models/menu-item.model';
import { ADMIN_MENU_ITEMS } from '../../common/menu-items';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input() menuItems: MenuItem[] = ADMIN_MENU_ITEMS;
}