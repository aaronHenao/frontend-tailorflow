import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CustomersService } from '../../../../services/customers.service';
import { Customer } from '../../../../core/models/customer.model';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './edit-customer.html',
  styleUrl: './edit-customer.scss'
})
export class EditCustomer implements OnInit {
  editForm!: FormGroup;
  customerId!: number;
  customer!: Customer;
  isLoading = true;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customersService: CustomersService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.customerId = +this.route.snapshot.params['id'];
    this.loadCustomer();
  }

 
  initForm(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.maxLength(100)]],
      address: ['', [Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(15)]]
    });
  }


  loadCustomer(): void {
    this.customersService.getById(this.customerId).subscribe({
      next: (response) => {
        this.customer = response.data;

        this.editForm.patchValue({
          name: this.customer.name,
          address: this.customer.address,
          phone: this.customer.phone
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando cliente', err);
        alert('Error al cargar el cliente');
        this.isLoading = false;
        this.router.navigate(['/admin/customers']);
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSaving = true
    const formValue = this.editForm.value; 
    const updateData: any = {};

    if (formValue.name){
      updateData.name = formValue.name;
    }

    if (formValue.address){
     updateData.address = formValue.address; 
    }
    if (formValue.phone){
      updateData.phone = formValue.phone;
    } 

    this.customersService.update(this.customerId, updateData).subscribe({
      next: () => {
        alert('Cliente actualizado exitosamente');
        this.router.navigate(['/admin/customers']);
      },
      error: (err) => {
        console.error('Error actualizando cliente', err);
        alert('Error al actualizar cliente: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/customers']);
  }
}