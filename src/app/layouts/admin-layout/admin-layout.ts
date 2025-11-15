import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';


@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule, 
    Navbar,       
    Sidebar           
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {

  sidebarOpened = true;

  toggleSidebar(): void {

    this.sidebarOpened = !this.sidebarOpened;
  }
}