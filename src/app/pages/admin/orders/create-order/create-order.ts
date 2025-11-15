import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OrdersService } from '../../../../services/orders.service';
import { CustomersService } from '../../../../services/customers.service';
import { CategoriesService } from '../../../../services/categories.service';
import { Customer } from '../../../../core/models/customer.model';
import { Category } from '../../../../core/models/category.model';
import { CreateProductPayload } from '../../../../core/models api/api.model';
import { ResponseDto } from '../../../../core/models/response.dto';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule
  ],
  templateUrl: './create-order.html',
  styleUrl: './create-order.scss'
})
export class CreateOrder implements OnInit {
  orderForm!: FormGroup;
  productsForm!: FormGroup;
  isSubmitting = false;

  customers: Customer[] = [];
  categories: Category[] = [];
  customerSearchControl = new FormControl('');
  filteredCustomers!: Observable<Customer[]>;

  createdOrderId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ordersService: OrdersService,
    private customersService: CustomersService,
    private categoriesService: CategoriesService
  ) {

    this.orderForm = this.fb.group({
      id_customer: [null, Validators.required],
      estimated_delivery_date: [null, [Validators.required, this.futureDateValidator]]
    });

    this.productsForm = this.fb.group({
      products: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadCategories();
    this.setupCustomerFilter();
  }

  futureDateValidator(control: AbstractControl) {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate < today ? { pastDate: true } : null;
  }

  get products(): FormArray {
    return this.productsForm.get('products') as FormArray;
  }

  addProduct(): void {
    const productGroup = this.fb.group({
      name: ['', Validators.required],
      id_category: [null, Validators.required],
      customized: [false],
      fabric: ['', Validators.required],
      dimensions: [''],
      description: [''],
    });

    this.products.push(productGroup);
  }

  removeProduct(index: number): void {
    this.products.removeAt(index);
  }

  
  loadCustomers(): void {
    this.customersService.getAllForForms().subscribe({
      next: (response) => {
        this.customers = response.data;
      },
      error: (err) => console.error('Error cargando clientes', err)
    });
  }

  loadCategories(): void {
    this.categoriesService.getAll().subscribe({
      next: (response: ResponseDto<Category[]>) => this.categories = response.data,
      error: (err) => console.error('Error cargando categorías', err)
    });
  }


  getProductGroup(index: number): FormGroup {
    return this.products.at(index) as FormGroup;
  }


  createOrderAndContinue(stepper: MatStepper): void {
    if (this.orderForm.valid) {
      const orderBaseData = {
        id_customer: this.orderForm.value.id_customer,
        estimated_delivery_date: this.formatDate(this.orderForm.value.estimated_delivery_date),
      };

      this.ordersService.create(orderBaseData).subscribe({
        next: (response) => {
          this.createdOrderId = response.data.id_order;
          stepper.next();
        },
        error: (err) => {
          console.error('Error al crear la orden base', err);
          console.error('Error al crear la orden: ' + (err.error?.message || err.message));
        }
      });
    } else {
      this.orderForm.markAllAsTouched();
      console.error('Por favor complete todos los campos requeridos del primer paso.');
    }
  }

  onSubmit(): void {
    if (!this.createdOrderId || !this.productsForm.valid) {
      console.error('Por favor, complete todos los pasos y campos requeridos correctamente. Verifique las advertencias de stock.');
      this.productsForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const productsData = this.productsForm.value.products;
    let productCreationObservables: Observable<any>[] = [];


    productsData.forEach((product: any, index: number) => {
      const productPayload: CreateProductPayload = {
        id_order: this.createdOrderId!,
        id_category: product.id_category,
        name: product.name,
        customized: product.customized ? 1 : 0,
        fabric: product.fabric,
        dimensions: product.dimensions || undefined,
        description: product.description || undefined,
      };

      const productCreation$ = this.ordersService.createProduct(productPayload).pipe(
        map((response) => {
          console.log(`Producto ${response.data.id_product} creado correctamente.`);
          return response;
        }),
        catchError(err => {
          console.error(`Error al crear el producto ${index + 1}:`, err);
          return throwError(() => new Error('Error al crear un producto (incluye materiales/flujo): ' + (err.error?.message || err.message)));
        })
      );
      productCreationObservables.push(productCreation$);
    });


    forkJoin(productCreationObservables).subscribe({
      next: () => {
        this.isSubmitting = false;
        console.log('Pedido creado exitosamente con ID: ' + this.createdOrderId + '. (Productos, materiales y tareas procesadas)');
        this.router.navigate(['/admin/orders']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error fatal durante la creación del pedido:', error);
        console.error('Error al finalizar el pedido: ' + error.message);
      }
    });
  }

  private formatDate(date: Date): string {

    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  setupCustomerFilter(): void {
    this.filteredCustomers = this.customerSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomers(value || ''))
    );
  }

  private _filterCustomers(value: string): Customer[] {
    const filterValue = value.toLowerCase();
    return this.customers.filter(customer =>
      customer.name.toLowerCase().includes(filterValue)
    );
  }

  onCustomerSelected(event: any): void {
    this.orderForm.patchValue({
      id_customer: event.option.value.id_customer
    });
  }

  displayCustomerName = (customer: Customer): string => {
    return customer ? customer.name : '';
  };

  displayCustomer(id: number): string {
    return ''; 
  }

}
