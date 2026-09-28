import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { NewsService } from '../../services/news.service';
import { Hero } from './hero/hero';
import { Categories } from './categories/categories';
import { FeaturedNews } from './featured-news/featured-news';
import { LatestNews } from './latest-news/latest-news';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, Hero, Categories, FeaturedNews, LatestNews],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private readonly news = inject(NewsService);
  private readonly reload$ = new BehaviorSubject(0);
  protected readonly vm$ = this.reload$.pipe(
    switchMap(() =>
      this.news.obtenerNoticias().pipe(
        map((articles) => ({
          featured: articles.filter((a) => a.destacada),
          latest: [...articles].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 4),
          hero: articles.find((a) => a.id === 10),
          loading: false,
          error: '',
        })),
        startWith({ featured: [], latest: [], hero: undefined, loading: true, error: '' }),
        catchError((error: Error) =>
          of({ featured: [], latest: [], hero: undefined, loading: false, error: error.message }),
        ),
      ),
    ),
  );
  protected retry(): void {
    this.reload$.next(this.reload$.value + 1);
  }
}
