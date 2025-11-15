import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CustomersService } from '../../../../services/customers.service';
import { Customer } from '../../../../core/models/customer.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './customers-list.html',
  styleUrl: './customers-list.scss'
})
export class CustomersList implements OnInit {
  customers: Customer[] = [];
  displayedColumns: string[] = ['name', 'phone', 'address', 'actions'];
  isLoading = false;

  constructor(private customersService: CustomersService, private router: Router) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customersService.getAll().subscribe({
      next: (response) => {
        this.customers = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando clientes', err);
        this.isLoading = false;
      }
    });
  }

  createCustomer(): void {
    this.router.navigate(['/admin/customers/create']);
  }

  editCustomer(customer: Customer): void{
    this.router.navigate(['/admin/customers/edit', customer.id_customer]);
  }
}