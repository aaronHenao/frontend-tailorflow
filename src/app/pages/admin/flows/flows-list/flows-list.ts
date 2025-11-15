import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FlowsService } from '../../../../services/flows.service';
import { Flow } from '../../../../core/models/flow.model';

@Component({
  selector: 'app-flows-list',
  standalone: true,
  imports: [
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './flows-list.html',
  styleUrl: './flows-list.scss'
})
export class FlowsList implements OnInit {
  flows: Flow[] = [];
  displayedColumns: string[] = ['category', 'sequence', 'role', 'area', 'actions'];
  isLoading = false;

  constructor(
    private flowsService: FlowsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFlows();
  }

  loadFlows(): void {
    this.isLoading = true;
    this.flowsService.getAll().subscribe({
      next: (response) => {
        this.flows = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando flujos', err);
        this.isLoading = false;
      }
    });
  }

  createFlow(): void{
    this.router.navigate(['/admin/flows/create']);
  }

  editFlow(flow: Flow): void {
    this.router.navigate(['/admin/flows/edit', flow.id_flow]);
  }
}