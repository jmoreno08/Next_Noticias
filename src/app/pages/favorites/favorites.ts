import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { NewsService } from '../../services/news.service';
import { FavoritesService } from '../../services/favorites.service';
import { NewsCard } from '../../shared/news-card/news-card';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [AsyncPipe, RouterLink, NewsCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  private readonly news = inject(NewsService);
  private readonly favorites = inject(FavoritesService);
  private readonly reload$ = new BehaviorSubject(0);
  protected readonly vm$ = combineLatest([toObservable(this.favorites.ids), this.reload$]).pipe(
    switchMap(([ids]) => {
      const empty = { articles: [], loading: false, error: '' };
      if (!ids.length) return of(empty);
      return this.news.obtenerNoticias().pipe(
        map((articles) => ({
          ...empty,
          articles: articles.filter((article) => ids.includes(article.id)),
        })),
        startWith({ ...empty, loading: true }),
        catchError((error: Error) => of({ ...empty, error: error.message })),
      );
    }),
  );
  protected retry(): void {
    this.reload$.next(this.reload$.value + 1);
  }
}
