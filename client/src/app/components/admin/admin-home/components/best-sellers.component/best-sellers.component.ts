import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../../../../services/stats.service';

@Component({
  selector: 'app-best-sellers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.css']
})
export class BestSellersComponent {
  bestSellers = signal<{ id: string; title: string; sales: number }[]>([]);
  private statsService = inject(StatsService);

  constructor() {
    effect(() => {
      this.loadBestSellers();
    });
  }

  private loadBestSellers() {
    this.statsService.getBestSellers().subscribe({
      next: data => this.bestSellers.set(data.slice(0, 5)),
      error: err => console.error('Error fetching best sellers', err)
    });
  }
}
