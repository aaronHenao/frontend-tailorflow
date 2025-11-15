import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TasksService } from '../../../../services/tasks.service';
import { ProductsService } from '../../../../services/products.service';
import { EmployeesService } from '../../../../services/employee.service';
import { AuthService } from '../../../../services/auth.service';
import { Task } from '../../../../core/models/task.model';
import { ProductDetailDialog } from './product-detail-dialog/product-detail-dialog';

interface GroupedTasks {
  productId: number;
  productName: string;
  tasks: Task[];
}

@Component({
  selector: 'app-employee-tasks',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './employee-tasks.html',
  styleUrl: './employee-tasks.scss'
})
export class EmployeeTasks implements OnInit {
  currentEmployeeTasks: Task[] = []; // Tareas del empleado actual (La que muestro)
  productTasks: Map<number, Task[]> = new Map(); // Todas las tareas por producto (para validación)
  groupedTasks: GroupedTasks[] = []; // Tareas del empleado actual
  isLoading = true;
  errorMessage = '';
  processingTaskId: number | null = null;
  loadingProductId: number | null = null;
  // Productos cuya lista completa de tareas se está cargando
  productTasksLoading: Set<number> = new Set();

  currentEmployeeId: number | null = null;

  constructor(
    private tasksService: TasksService,
    private productsService: ProductsService,
    private employeesService: EmployeesService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEmployeeAndTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    // Cargar el id del empleado actual
    if (this.currentEmployeeId == null) {
      this.loadEmployeeAndTasks();
      return;
    }

    this.tasksService.getAssignedTasks().subscribe({
      next: (response) => {
        // Tareas asignadas al empleado actual y que estén pendientes o en progreso
        this.currentEmployeeTasks = response.data.filter(task => 
          task.id_employee === this.currentEmployeeId && 
          (task.id_state === 1 || task.id_state === 2)
        );
        
        
        this.groupTasksByProduct();

        //Para respetar la seuencia por producto
        for (const group of this.groupedTasks) {
          this.findTaskOfProduct(group.productId);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando tareas:', err);
        this.errorMessage = err.error?.message || 'Error al cargar las tareas asignadas';
        this.isLoading = false;
      }
    });
  }

  loadEmployeeAndTasks(): void {
    this.isLoading = true;
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.cc) {
      this.errorMessage = 'No se pudo obtener la información del usuario';
      this.isLoading = false;
      return;
    }

    this.employeesService.getEmployeeDetails(currentUser.cc).subscribe({
      next: (response) => {
        this.currentEmployeeId = response.data.id_employee;
        this.loadTasks();
      },
      error: (err) => {
        console.error('Error cargando datos del empleado actual:', err);
        this.errorMessage = 'Error al cargar la información del empleado';
        this.isLoading = false;
      }
    });
  }

  groupTasksByProduct(): void {
    const grouped = new Map<number, GroupedTasks>();

    // SOLO las tareas del empleado actual
    this.currentEmployeeTasks.forEach((task: Task) => {
      if (!grouped.has(task.id_product)) {
        grouped.set(task.id_product, {
          productId: task.id_product,
          productName: task.product?.name || `Producto ${task.id_product}`,
          tasks: []
        });
      }
      grouped.get(task.id_product)!.tasks.push(task);
    });

    this.groupedTasks = Array.from(grouped.values()).map(group => ({
      ...group,
      tasks: group.tasks.sort((a, b) => a.sequence - b.sequence)
    }));
  }

  onViewProductDetail(productId: number): void {
    this.loadingProductId = productId;

    this.productsService.getById(productId).subscribe({
      next: (response) => {
        this.loadingProductId = null;
        this.dialog.open(ProductDetailDialog, {
          data: response.data,
          width: '600px',
          maxWidth: '90vw'
        });
      },
      error: (err) => {
        console.error('Error cargando detalle del producto:', err);
        alert('Error al cargar el detalle del producto');
        this.loadingProductId = null;
      }
    });
  }

  onStartTask(task: Task): void {
    if (!this.canStartTask(task)) {
      return;
    }

    this.processingTaskId = task.id_task;

    this.tasksService.startTask(task.id_task).subscribe({
      next: (response) => {
        alert(response.message);
        this.loadTasks();
        this.processingTaskId = null;
      },
      error: (err) => {
        console.error('Error iniciando tarea:', err);
        alert(err.error?.message || 'Error al iniciar la tarea');
        this.processingTaskId = null;
      }
    });
  }

  onCompleteTask(task: Task): void {
    if (!this.canCompleteTask(task)) {
      return;
    }

    this.processingTaskId = task.id_task;

    this.tasksService.completeTask(task.id_task).subscribe({
      next: (response) => {
        alert(response.message);
        this.loadTasks();
        this.processingTaskId = null;
      },
      error: (err) => {
        console.error('Error completando tarea:', err);
        alert(err.error?.message || 'Error al completar la tarea');
        this.processingTaskId = null;
      }
    });
  }

  findTaskOfProduct(id:number){
    // Evitar llamadas duplicadas
    if (this.productTasksLoading.has(id)) return;
    this.productTasksLoading.add(id);

    // Llamar al servicio para traer todas las tareas del producto
    this.tasksService.getProductTasks(id).subscribe({
      next: (response) => {
        const productTasks = response.data || [];
        // Ordenar por sequence y guardar para validación
        productTasks.sort((a, b) => a.sequence - b.sequence);
        this.productTasks.set(id, productTasks);
        
        this.productTasksLoading.delete(id);
      },
      error: (err) => {
        console.error(`Error cargando tareas del producto ${id}:`, err);
        this.productTasksLoading.delete(id);
      }
    });
  }

  canStartTask(task: Task): boolean {
    if (task.id_state !== 1) {
      return false;
    }

    // Sólo bloquear si el empleado que quiere iniciar tiene una tarea en proceso
    const hasTaskInProgress = this.currentEmployeeTasks.some(t => t.id_state === 2);
    if (hasTaskInProgress) {
      return false;
    }

    // Si todavía se está cargando la lista completa de tareas del producto, bloquear hasta tener la información
    if (this.productTasksLoading.has(task.id_product)) {
      return false;
    }

    // FIFO por empleado: sólo permitir iniciar la primera tarea pendiente/no completada del empleado
    const employeePending = this.currentEmployeeTasks;
    const firstPending = employeePending.length ? employeePending[0] : null;
    if (firstPending && firstPending.id_task !== task.id_task) {
      return false;
    }

    // Verificar la secuencia dentro del producto: la tarea anterior del mismo producto debe estar COMPLETADA
    const productTasks = this.productTasks.get(task.id_product) || [];
    if (task.sequence === 1) {
      return true;
    }

    const previousTask = productTasks.find(t => t.sequence === task.sequence - 1);
    return previousTask ? previousTask.id_state === 3 : false;
  }

  canCompleteTask(task: Task): boolean {
    return task.id_state === 2;
  }

  getTaskStatusColor(stateId: number): 'primary' | 'accent' | 'warn' {
    switch (stateId) {
      case 1: 
        return 'warn';
      case 2:
        return 'accent';
      case 3: 
        return 'primary';
      default:
        return 'warn';
    }
  }

  getTaskStatusIcon(stateId: number): string {
    switch (stateId) {
      case 1: 
        return 'schedule';
      case 2: 
        return 'update';
      case 3: 
        return 'check_circle';
      default:
        return 'help';
    }
  }


  formatDate(date: Date | null | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}