import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlowsService } from '../../../../services/flows.service';
import { RolesService } from '../../../../services/roles.service';
import { Flow } from '../../../../core/models/flow.model';
import { Role } from '../../../../core/models/role.model';

@Component({
  selector: 'app-edit-flow',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './edit-flow.html',
  styleUrl: './edit-flow.scss'
})
export class EditFlow implements OnInit {
  flowForm: FormGroup;
  flowId!: number;
  flow!: Flow;
  roles: Role[] = [];
  isLoading = true;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private flowsService: FlowsService,
    private rolesService: RolesService
  ) {
    this.flowForm = this.fb.group({
      id_role: [null, Validators.required],
      sequence: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.flowId = +this.route.snapshot.params['id'];
    this.loadRoles();
    this.loadFlow();
  }

  loadRoles(): void {
    this.rolesService.getAll().subscribe({
      next: (response) => {
        this.roles = response.data;
      },
      error: (err) => console.error('Error cargando roles', err)
    });
  }

  loadFlow(): void {
    this.flowsService.getById(this.flowId).subscribe({
      next: (response) => {
        this.flow = response.data;
        
        this.flowForm.patchValue({
          id_role: this.flow.role.id_role,
          sequence: this.flow.sequence
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando flujo', err);
        alert('Error al cargar flujo');
        this.router.navigate(['/admin/flows']);
      }
    });
  }

  onSubmit(): void {
    if (!this.flowForm.valid) {
      this.flowForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.flowsService.update(this.flowId, this.flowForm.value).subscribe({
      next: (response) => {
        alert('Flujo actualizado exitosamente');
        this.router.navigate(['/admin/flows']);
      },
      error: (err) => {
        console.error('Error actualizando flujo', err);
        alert('Error al actualizar flujo: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/flows']);
  }
}