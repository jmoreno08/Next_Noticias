import { NewsImage } from '../../../shared/news-image';
import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { News } from '../../../models/news';
@Component({
  selector: 'app-latest-news',
  standalone: true,
  imports: [NewsImage, DatePipe, RouterLink],
  templateUrl: './latest-news.html',
  styleUrl: './latest-news.css',
})
export class LatestNews {
  readonly articles = input.required<News[]>();
}
