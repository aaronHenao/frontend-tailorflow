import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OrdersService } from '../../../../services/orders.service';
import { OrderWithProducts } from '../../../../core/models/order.model';
import { MatDivider } from '@angular/material/divider';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDivider
  ],
  templateUrl: './edit-order.html',
  styleUrl: './edit-order.scss'
})
export class EditOrder implements OnInit {
  editForm!: FormGroup;
  orderId!: number;
  order!: OrderWithProducts;
  isLoading = true;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ordersService: OrdersService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.params['id'];
    this.loadOrder();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      estimated_delivery_date: [null, Validators.required],
      products: this.fb.array([])
    });
  }

  get products(): FormArray {
    return this.editForm.get('products') as FormArray;
  }

  loadOrder(): void {
    this.ordersService.getOrderWithProducts(this.orderId).subscribe({
      next: (response) => {
        this.order = response.data;

        if (this.order.state_name !== 'PENDING') {
          alert('Este pedido no puede ser editado porque no está en estado PENDIENTE');
          this.router.navigate(['/admin/orders']);
          return;
        }

        this.editForm.patchValue({
          estimated_delivery_date: new Date(this.order.estimated_delivery_date || '')
        });

        this.order.products?.forEach(product => {
          this.products.push(this.fb.group({
            id_product: [product.id_product],
            name: [{ value: product.name, disabled: true }],
            fabric: [product.fabric, Validators.required],
            dimensions: [product.dimensions],
            description: [product.description]
          }));
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando pedido', err);
        alert('Error al cargar el pedido');
        this.router.navigate(['/admin/orders']);
      }
    });
  }

  onSubmit(): void {
    if (!this.editForm.valid) {
      this.editForm.markAllAsTouched();
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    this.isSaving = true;


    const orderUpdate = {
      estimated_delivery_date: this.formatDate(this.editForm.value.estimated_delivery_date)
    };

    this.ordersService.update(this.orderId, orderUpdate).subscribe({
      next: () => {
        this.updateProducts();
      },
      error: (err) => {
        console.error('Error actualizando pedido', err);
        alert('Error al actualizar el pedido: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  updateProducts(): void {
    const productUpdates = this.editForm.value.products.map((product: any) => {
      const productData = {
        fabric: product.fabric,
        dimensions: product.dimensions,
        description: product.description
      };

      return this.ordersService.updateProduct(product.id_product, productData);
    });

    forkJoin(productUpdates).subscribe({
      next: () => {
        this.isSaving = false;
        alert('Pedido actualizado exitosamente');
        this.router.navigate(['/admin/orders']);
      },
      error: (err) => {
        console.error('Error actualizando productos', err);
        alert('Error al actualizar algunos productos');
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/orders']);
  }

  private formatDate(date: Date): string {
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}