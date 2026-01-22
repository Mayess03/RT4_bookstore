import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../../services/stats.service';
import { forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHome implements OnInit {

  // ===== TOP STATS =====
  stats = signal<{ title: string; value: number; icon: string }[]>([]);

  // ===== CHART =====
  private chart!: Chart;
  selectedPeriod = signal<'day' | 'month'>('day');

  private statsService = inject(StatsService);

  ngOnInit() {
    this.loadStats();
    this.loadSalesByDay(); // default
  }

  // =============================
  // TOP STATS
  // =============================
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
      error: err => console.error('Error fetching stats', err)
    });
  }

  // =============================
  // SALES CHART
  // =============================
  onPeriodChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'day' | 'month';
    this.selectedPeriod.set(value);

    value === 'day'
      ? this.loadSalesByDay()
      : this.loadSalesByMonth();
  }

  private loadSalesByDay() {
    this.statsService.getSalesByDay().subscribe(data => {
      const labels = data.map(d => new Date(d.date).toLocaleDateString('fr-CA')); 
      const values = data.map(d => d.totalSales);
      this.renderChart(labels, values, 'Sales per Day');
    });
  }

  private loadSalesByMonth() {
    this.statsService.getSalesByMonth().subscribe(data => {
      const labels = data.map(d => d.month);
      const values = data.map(d => d.totalSales);
      this.renderChart(labels, values, 'Sales per Month');
    });
  }

  private renderChart(labels: string[], values: number[], label: string) {

  if (this.chart) {
    this.chart.destroy();
  }

  this.chart = new Chart('salesChart', {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          data: values,
          borderColor: '#FFC107',
          backgroundColor: 'rgba(255,193,7,0.15)',
          tension: 0.4,
          borderWidth: 3,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#FFC107'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

}
