import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsBoxesComponent } from './components/stats-boxes.component/stats-boxes.component';
import { AnalyticsChartComponent } from './components/analytics-chart.component/analytics-chart.component';
import { OutOfStockComponent } from './components/out-of-stock.component/out-of-stock.component';
import { PendingOrdersComponent } from './components/pending-orders.component/pending-orders.component';
import { BestSellersComponent } from './components/best-sellers.component/best-sellers.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    StatsBoxesComponent,
    AnalyticsChartComponent,
    OutOfStockComponent,
    PendingOrdersComponent,
    BestSellersComponent
  ],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHome {}
