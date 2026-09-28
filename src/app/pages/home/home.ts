import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { Categories } from './categories/categories';
import { FeaturedNews } from './featured-news/featured-news';
import { LatestNews } from './latest-news/latest-news';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, Categories, FeaturedNews, LatestNews],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
