import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Book } from '../../../../models';

@Component({
  selector: 'app-book-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './book-form-dialog.html',
  styleUrl: './book-form-dialog.css'
})
export class BookFormDialog {
  isEditMode = false;
  
  formData: {
    title: string;
    author: string;
    description: string;
    price: number;
    isbn: string;
    stock: number;
    coverImage: string;
    categoryId: string;
  } = {
    title: '',
    author: '',
    description: '',
    price: 0,
    isbn: '',
    stock: 0,
    coverImage: '',
    categoryId: ''
  };

  constructor(
    public dialogRef: MatDialogRef<BookFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      book?: Book; 
      categories: Array<{ id: string; name: string }> 
    }
  ) {
    if (this.data.book) {
      this.isEditMode = true;
      this.formData = {
        title: this.data.book.title,
        author: this.data.book.author,
        description: this.data.book.description || '',
        price: +this.data.book.price,
        isbn: this.data.book.isbn,
        stock: this.data.book.stock,
        coverImage: this.data.book.coverImage || '',
        categoryId: this.data.book.categoryId || ''
      };
    }
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.dialogRef.close(this.formData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  isFormValid(): boolean {
    return !!(
      this.formData.title &&
      this.formData.author &&
      this.formData.description &&
      this.formData.price > 0 &&
      this.formData.isbn &&
      this.formData.stock >= 0
    );
  }
}
