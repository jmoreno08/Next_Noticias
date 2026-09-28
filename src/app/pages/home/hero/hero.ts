import { NewsImage } from '../../../shared/news-image';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { News } from '../../../models/news';
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NewsImage, RouterLink],
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {
  readonly featured = input<News>();
}
