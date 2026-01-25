import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../../services/stats.service';
import { StatsBoxesComponent } from './components/stats-boxes.component/stats-boxes.component';
import { AnalyticsChartComponent } from './components/analytics-chart.component/analytics-chart.component';
import { forkJoin } from 'rxjs';
import { OutOfStockComponent } from './components/out-of-stock.component/out-of-stock.component';
import { PendingOrdersComponent } from './components/pending-orders.component/pending-orders.component';
import { BestSellersComponent } from './components/best-sellers.component/best-sellers.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, StatsBoxesComponent, AnalyticsChartComponent, OutOfStockComponent, PendingOrdersComponent, BestSellersComponent],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHome implements OnInit {
  stats = signal<{ title: string; value: number; icon: string }[]>([]);
  selectedPeriod = signal<'day' | 'month'>('day');
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
          { title: 'Revenue (DT)', value: revenue.totalRevenue, icon: 'fa-solid fa-dollar-sign' }
        ]);
      },
      error: err => console.error(err)
    });
  }
}
