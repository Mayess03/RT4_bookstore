import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StatsService } from '../../../../../services/stats.service';

@Component({
  selector: 'app-out-of-stock-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './out-of-stock.component.html',
  styleUrls: ['./out-of-stock.component.css']
})
export class OutOfStockComponent implements OnInit {

  outOfStockCount = signal(0);

  private statsService = inject(StatsService);
  private router = inject(Router);

  ngOnInit() {
    this.statsService.getOutOfStockBooks().subscribe({
      next: (data) => this.outOfStockCount.set(data.length),
      error: (err) => console.error('Error fetching out-of-stock books', err)
    });
  }

  goToBooks() {
    this.router.navigate(['/admin/books']);
  }
}
