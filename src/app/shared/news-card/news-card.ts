import { NewsImage } from '../news-image';
import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { News } from '../../models/news';
import { FavoriteButton } from '../favorite-button/favorite-button';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [NewsImage, DatePipe, RouterLink, FavoriteButton],
  templateUrl: './news-card.html',
  styleUrl: './news-card.css',
})
export class NewsCard {
  readonly article = input.required<News>();
}
