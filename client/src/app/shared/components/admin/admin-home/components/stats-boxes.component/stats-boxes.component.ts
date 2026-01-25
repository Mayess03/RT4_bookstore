import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-boxes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-boxes.component.html',
  styleUrls: ['./stats-boxes.component.css']
})
export class StatsBoxesComponent {
  @Input() stats = signal<{ title: string; value: number; icon: string }[]>([]);
}
