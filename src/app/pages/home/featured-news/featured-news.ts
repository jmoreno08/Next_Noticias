import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { News } from '../../../models/news';
import { NewsCard } from '../../../shared/news-card/news-card';
@Component({
  selector: 'app-featured-news',
  standalone: true,
  imports: [RouterLink, NewsCard],
  templateUrl: './featured-news.html',
  styleUrl: './featured-news.css',
})
export class FeaturedNews {
  readonly articles = input.required<News[]>();
}
