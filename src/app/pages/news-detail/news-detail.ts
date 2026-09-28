import { NewsImage } from '../../shared/news-image';
import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { NewsService } from '../../services/news.service';
import { NewsCard } from '../../shared/news-card/news-card';
import { FavoriteButton } from '../../shared/favorite-button/favorite-button';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [NewsImage, AsyncPipe, DatePipe, RouterLink, NewsCard, FavoriteButton],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.css',
})
export class NewsDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly news = inject(NewsService);
  private readonly reload$ = new BehaviorSubject(0);
  protected readonly vm$ = combineLatest([this.route.paramMap, this.reload$]).pipe(
    switchMap(([params]) => {
      const rawId = params.get('id') ?? '';
      const id = /^\d+$/.test(rawId) ? Number(rawId) : NaN;
      const empty = { article: undefined, related: [], loading: false, error: '' };
      if (!Number.isSafeInteger(id) || id < 1) return of(empty);
      return this.news.obtenerNoticias().pipe(
        map((articles) => {
          const article = articles.find((item) => item.id === id);
          return {
            ...empty,
            article,
            related: articles
              .filter((item) => item.id !== id && item.categoria === article?.categoria)
              .slice(0, 3),
          };
        }),
        startWith({ ...empty, loading: true }),
        catchError((error: Error) => of({ ...empty, error: error.message })),
      );
    }),
  );
  protected retry(): void {
    this.reload$.next(this.reload$.value + 1);
  }
}
