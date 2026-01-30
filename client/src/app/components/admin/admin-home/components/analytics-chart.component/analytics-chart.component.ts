import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../../../../services/stats.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-chart.component.html',
  styleUrls: ['./analytics-chart.component.css']
})
export class AnalyticsChartComponent {
  selectedPeriod = signal<'day' | 'month'>('day');

  private chart!: Chart;
  private statsService = inject(StatsService);

  constructor() {
    effect(() => {
      const period = this.selectedPeriod();
      period === 'day' ? this.loadSalesByDay() : this.loadSalesByMonth();
    });
  }

  setPeriod(period: 'day' | 'month') {
    this.selectedPeriod.set(period);
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
    if (this.chart) this.chart.destroy();

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
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}
