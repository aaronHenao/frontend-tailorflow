import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TasksService } from '../../../services/tasks.service';
import { ProductsService } from '../../../services/products.service';
import { Task } from '../../../core/models/task.model';
import { ProductDetailDialog } from '../tasks/employee-tasks/product-detail-dialog/product-detail-dialog';

interface GroupedCompletedTasks {
  productId: number;
  productName: string;
  tasks: Task[];
  totalDuration: number;
}

@Component({
  selector: 'app-completed-tasks',
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
  templateUrl: './completed-tasks.html',
  styleUrl: './completed-tasks.scss'
})
export class CompletedTasks implements OnInit {
  tasks: Task[] = [];
  groupedTasks: GroupedCompletedTasks[] = [];
  isLoading = true;
  errorMessage = '';
  loadingProductId: number | null = null;

  constructor(
    private tasksService: TasksService,
    private productsService: ProductsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCompletedTasks();
  }

  loadCompletedTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.tasksService.getAssignedTasks().subscribe({
      next: (response) => {
        this.tasks = response.data.filter(task => task.id_state === 3);
        this.groupTasksByProduct();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando tareas completadas:', err);
        this.errorMessage = err.error?.message || 'Error al cargar las tareas completadas';
        this.isLoading = false;
      }
    });
  }

  groupTasksByProduct(): void {
    const grouped = new Map<number, GroupedCompletedTasks>();

    this.tasks.forEach(task => {
      if (!grouped.has(task.id_product)) {
        grouped.set(task.id_product, {
          productId: task.id_product,
          productName: task.product?.name || `Producto ${task.id_product}`,
          tasks: [],
          totalDuration: 0
        });
      }
      grouped.get(task.id_product)!.tasks.push(task);
    });

    this.groupedTasks = Array.from(grouped.values()).map(group => {
      const sortedTasks = group.tasks.sort((a, b) => a.sequence - b.sequence);
      return {
        ...group,
        tasks: sortedTasks,
        totalDuration: this.calculateTotalDuration(sortedTasks)
      };
    });
  }

  calculateTotalDuration(tasks: Task[]): number {
    let totalHours = 0;
    tasks.forEach(task => {
      if (task.start_date && task.end_date) {
        const start = new Date(task.start_date).getTime();
        const end = new Date(task.end_date).getTime();
        const hours = (end - start) / (1000 * 60 * 60);
        totalHours += hours;
      }
    });
    return totalHours;
  }

  calculateDuration(startDate: Date | null | undefined, endDate: Date | null | undefined): string {
    if (!startDate || !endDate) return 'N/A';
    
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffMs = end - start;
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h`;
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

  formatDate(date: Date | null | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTotalDuration(hours: number): string {
    if (hours === 0) return 'N/A';
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    
    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${remainingHours}h`;
  }
}