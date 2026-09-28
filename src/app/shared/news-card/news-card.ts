import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { News } from '../../models/news';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './news-card.html',
  styleUrl: './news-card.css',
})
export class NewsCard {
  readonly article = input.required<News>();
}
