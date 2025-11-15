import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Product } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-product-detail-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './product-detail-dialog.html',
  styleUrl: './product-detail-dialog.scss'
})
export class ProductDetailDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public product: Product
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}