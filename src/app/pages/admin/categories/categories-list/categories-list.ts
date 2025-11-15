import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoriesService } from '../../../../services/categories.service'; 
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.scss'
})
export class CategoriesList implements OnInit {
  categories: Category[] = [];
  displayedColumns: string[] = ['id_category', 'name', 'description', 'actions']; 
  isLoading = false;

  constructor(private categoriesService: CategoriesService, private router: Router) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    
    this.categoriesService.getAll().subscribe({ 
      next: (response) => {
        this.categories = response.data; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.isLoading = false;
        alert('Error al cargar la lista de categorías: ' + (err.error?.message || 'Error de conexión'));
      }
    });
  }

  createCategory(): void {
    this.router.navigate(['/admin/categories/create']);
  }

  editCategory(category: Category): void {
    this.router.navigate(['/admin/categories/edit', category.id_category]);
  }
}