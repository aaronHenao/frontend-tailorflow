import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { EmployeesService } from '../../../../services/employee.service';
import { Employee } from '../../../../core/models/employee.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'; 


@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule 
  ],
  templateUrl: './employees-list.html',
  styleUrl: './employees-list.scss'
})
export class EmployeesList implements OnInit {
  employees: Employee[] = [];
  displayedColumns: string[] = ['cc', 'name', 'role', 'state', 'actions']; 
  isLoading = false;

  constructor(private employeesService: EmployeesService, private router: Router) { }

  ngOnInit(): void {
    this.loadEmployees();
  }
  
  
  loadEmployees(): void {
    this.isLoading = true;
    this.employeesService.getAll().subscribe({
      next: (response) => {
        this.employees = response.data; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando empleados', err);
        alert('Hubo un error al cargar la lista de empleados.'); 
        this.isLoading = false;
      }
    });
  }

  createEmployee(): void {
    this.router.navigate(['/admin/employees/create']);
  }

  
  editEmployee(employee: Employee): void {
    this.router.navigate(['/admin/employees/edit', employee.id_employee]);
  }

}