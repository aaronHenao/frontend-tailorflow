import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { CategoriesService } from '../../../../services/categories.service';
import { FlowsService } from '../../../../services/flows.service';
import { RolesService } from '../../../../services/roles.service';
import { Role } from '../../../../core/models/role.model';
import { ResponseDto } from '../../../../core/models/response.dto';

import { from, throwError } from 'rxjs';
import { concatMap, tap, catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-category',
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
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './create-category.html',
  styleUrl: './create-category.scss'
})
export class CreateCategory implements OnInit {
  categoryForm: FormGroup;
  flowsForm: FormGroup;

  isSaving = false;       // para la creación de la categoría (paso 1)
  isSubmitting = false;   // para la creación de los flujos (paso 2)
  isLoading = true;

  roles: Role[] = [];
  createCategoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoriesService: CategoriesService,
    private flowsService: FlowsService,
    private rolesService: RolesService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(100)]]
    });

    this.flowsForm = this.fb.group({
      flows: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.isLoading = false;
  }

  /* ---------- Helpers para el FormArray ---------- */
  get flows(): FormArray {
    return this.flowsForm.get('flows') as FormArray;
  }

  addFlow(): void {
    const flowForm = this.fb.group({
      id_role: new FormControl(null, [Validators.required]),
      sequence: new FormControl(null, [Validators.required, Validators.min(1)])
    });
    this.flows.push(flowForm);
  }

  removeFlow(index: number): void {
    this.flows.removeAt(index);
  }

  getFlowsGroup(index: number): FormGroup {
    return this.flows.at(index) as FormGroup;
  }

  /* ---------- Carga de roles ---------- */
  loadRoles(): void {
    this.rolesService.getAll().subscribe({
      next: (response: ResponseDto<Role[]>) => {
        this.roles = response.data;
      },
      error: (err) => {
        console.error('Error cargando roles', err);
        // si falla la carga de roles, igual permitimos crear la categoría; puede que quieras bloquearlo en tu caso
      }
    });
  }

  /* ---------- Paso 1: crear categoría y avanzar ---------- */
  createCategoryAndContinue(stepper: MatStepper): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload = {
      name: this.categoryForm.value.name,
      description: this.categoryForm.value.description
    };

    this.categoriesService.create(payload).subscribe({
      next: (response: ResponseDto<any>) => {
        // asumo que la API devuelve { data: { id_category: number, ... } }
        this.createCategoryId = response.data?.id_category ?? null;
        if (!this.createCategoryId) {
          console.warn('No se obtuvo id_category en la respuesta al crear la categoría.');
        }
        this.isSaving = false;
        // Avanzar al siguiente paso
        stepper.next();
      },
      error: (err) => {
        console.error('Error creando categoría', err);
        alert('Error al crear categoría: ' + (err.error?.message || err.message || 'Error de conexión'));
        this.isSaving = false;
      }
    });
  }

  /* ---------- Paso final: crear flujos (uno por uno) ---------- */
  onSubmit(): void {
    // Validaciones
    if (!this.createCategoryId) {
      console.error('No existe createCategoryId. Debes crear la categoría primero.');
      alert('Primero crea la categoría en el primer paso.');
      return;
    }

    if (this.flows.length === 0) {
      alert('Agrega al menos un flujo antes de continuar.');
      return;
    }

    if (this.flowsForm.invalid) {
      this.flowsForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Creamos una copia de los flujos con la estructura que espera el backend
    const flowsToCreate = this.flows.value.map((f: any) => ({
      id_category: this.createCategoryId,
      id_role: f.id_role,
      sequence: f.sequence
    }));

    // Crear flujos uno por uno en secuencia usando concatMap
    from(flowsToCreate).pipe(
      concatMap(flowPayload =>
        this.flowsService.create(flowPayload).pipe(
          tap((resp) => {
            console.log('Flujo creado:', resp);
          }),
          catchError(err => {
            console.error('Error creando flujo', err);
            // Propagar el error para que la cadena termine y entre en el error del subscribe
            return throwError(() => err);
          })
        )
      ),
      finalize(() => {
        this.isSubmitting = false;
      })
    ).subscribe({
      next: () => {
        // cada flujo exitoso entra aquí; no hacemos nada extra por flujo
      },
      error: (err) => {
        console.error('Error durante la creación secuencial de flujos:', err);
        alert('Error al crear los flujos: ' + (err.error?.message || err.message || 'Error de conexión'));
        // dejamos isSubmitting en false vía finalize()
      },
      complete: () => {
        // todos los flujos creados correctamente
        console.log('Todos los flujos fueron creados correctamente.');
        alert('Categoría y flujos creados exitosamente.');
        this.router.navigate(['/admin/categories']);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/categories']);
  }
}
