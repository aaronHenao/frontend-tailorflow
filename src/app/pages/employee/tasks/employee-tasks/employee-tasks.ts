import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule,
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
  tasks: Task[] = [];
  groupedTasks: GroupedTasks[] = [];
  isLoading = true;
  errorMessage = '';
  processingTaskId: number | null = null;
  loadingProductId: number | null = null;

  constructor(
    private tasksService: TasksService,
    private productsService: ProductsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.tasksService.getAssignedTasks().subscribe({
      next: (response) => {
        this.tasks = response.data.filter(task => task.id_state === 1 || task.id_state === 2);
        this.groupTasksByProduct();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando tareas:', err);
        this.errorMessage = err.error?.message || 'Error al cargar las tareas asignadas';
        this.isLoading = false;
      }
    });
  }

  groupTasksByProduct(): void {
    const grouped = new Map<number, GroupedTasks>();

    this.tasks.forEach(task => {
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

  canStartTask(task: Task): boolean {
    if (task.id_state !== 1) {
      return false;
    }

    const productTasks = this.groupedTasks.find(g => g.productId === task.id_product)?.tasks || [];
    
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
      case 1: // Pending
        return 'schedule';
      case 2: // In Process
        return 'update';
      case 3: // Finished
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