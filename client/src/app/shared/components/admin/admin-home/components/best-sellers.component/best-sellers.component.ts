import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../../../../services/stats.service';

@Component({
  selector: 'app-best-sellers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.css']
})
export class BestSellersComponent implements OnInit {
  bestSellers = signal<{ id: string; title: string; sales: number }[]>([]);
  private statsService = inject(StatsService);

  ngOnInit() {
    this.loadBestSellers();
  }

  private loadBestSellers() {
    this.statsService.getBestSellers().subscribe({
      next: data => {
        this.bestSellers.set(data.slice(0, 5));
      },
      error: err => console.error('Error fetching best sellers', err)
    });
  }
}
