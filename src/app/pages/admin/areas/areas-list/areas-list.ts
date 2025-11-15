import { Component, OnInit} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AreasService } from '../../../../services/areas.service'; 
import { Area } from '../../../../core/models/area.model';

@Component({
  selector: 'app-areas-list',
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
  templateUrl: './areas-list.html',
  styleUrl: './areas-list.scss'
})
export class AreasList implements OnInit {
  areas: Area[] = [];
  displayedColumns: string[] = ['name', 'roles_count', 'actions']; 
  isLoading = false;

  constructor(private areasService: AreasService, private router: Router) { }

  ngOnInit(): void {
    this.loadAreas();
  }

  loadAreas(): void {
    this.isLoading = true;
    this.areasService.getAll().subscribe({ 
      next: (response) => {
        this.areas = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando áreas', err);
        this.isLoading = false;
        alert('Error al cargar la lista de áreas: ' + (err.error?.message || 'Error de conexión'));
      }
    });
  }

  createArea(): void {
    this.router.navigate(['/admin/areas/create']);
  }

  editArea(area: Area): void {
    this.router.navigate(['/admin/areas/edit', area.id_area]);
  }
}