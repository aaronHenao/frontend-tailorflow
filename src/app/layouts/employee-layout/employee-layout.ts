import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { MenuItem } from '../../core/models/menu-item.model';
import { EMPLOYEE_MENU_ITEMS } from '../../common/menu-items';

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    Navbar,
    Sidebar
  ],
  templateUrl: './employee-layout.html',
  styleUrl: './employee-layout.scss'
})
export class EmployeeLayout {
  sidebarOpened = true;
  readonly employeeMenuItems: MenuItem[] = EMPLOYEE_MENU_ITEMS;

  toggleSidebar(): void {
    this.sidebarOpened = !this.sidebarOpened;
  }
}