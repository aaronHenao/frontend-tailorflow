import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CustomersService } from '../../../../services/customers.service';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './create-customer.html',
  styleUrl: './create-customer.scss'
})
export class CreateCustomer {
  customerForm: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private customersService: CustomersService
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['']
    });
  }

  onSubmit(): void {
    if (!this.customerForm.valid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.customersService.create(this.customerForm.value).subscribe({
      next: (response) => {
        alert(`Cliente ${response.data.name} creado exitosamente`);
        this.router.navigate(['/admin/customers']);
      },
      error: (err) => {
        console.error('Error creando cliente', err);
        alert('Error al crear cliente: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/customers']);
  }
}