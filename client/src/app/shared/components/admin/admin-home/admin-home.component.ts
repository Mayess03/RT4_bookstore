import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../../services/stats.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHome implements OnInit {

  stats = signal<{ title: string; value: number; icon: string }[]>([]);

  private statsService = inject(StatsService);

  ngOnInit() {
    this.loadStats();
  }

  private loadStats() {
    forkJoin({
      global: this.statsService.getGlobalStats(),
      revenue: this.statsService.getRevenue()
    }).subscribe({
      next: ({ global, revenue }) => {
        this.stats.set([
          { title: 'Users', value: global.users, icon: 'fa-solid fa-users' },
          { title: 'Books', value: global.books, icon: 'fa-solid fa-book' },
          { title: 'Orders', value: global.orders, icon: 'fa-solid fa-cart-shopping' },
          { title: 'Revenue', value: revenue.totalRevenue, icon: 'fa-solid fa-dollar-sign' }
        ]);
      },
      error: err => console.error('Error fetching stats', err)
    });
  }
}
