import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../../../../services/stats.service';

@Component({
  selector: 'app-stats-boxes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-boxes.component.html',
  styleUrls: ['./stats-boxes.component.css']
})
export class StatsBoxesComponent {
  stats = signal<{ title: string; value: number; icon: string }[]>([]);

  private statsService = inject(StatsService);

  constructor() {
    effect(() => {
      this.loadStats();
    });
  }

  private loadStats() {
    this.statsService.getGlobalStats().subscribe({
      next: (global) => {
        this.statsService.getRevenue().subscribe({
          next: (revenue) => {
            this.stats.set([
              { title: 'Users', value: global.users, icon: 'fa-solid fa-users' },
              { title: 'Books', value: global.books, icon: 'fa-solid fa-book' },
              { title: 'Orders', value: global.orders, icon: 'fa-solid fa-cart-shopping' },
              { title: 'Revenue ($)', value: revenue.totalRevenue, icon: 'fa-solid fa-dollar-sign' }
            ]);
          },
          error: (err) => console.error('Error fetching revenue', err)
        });
      },
      error: (err) => console.error('Error fetching global stats', err)
    });
  }
}
