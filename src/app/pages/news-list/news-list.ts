import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { NewsService } from '../../services/news.service';
import { NewsCard } from '../../shared/news-card/news-card';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [AsyncPipe, NewsCard],
  templateUrl: './news-list.html',
  styleUrl: './news-list.css',
})
export class NewsList {
  private readonly news = inject(NewsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly reload$ = new BehaviorSubject(0);
  protected readonly vm$ = combineLatest([this.route.queryParamMap, this.reload$]).pipe(
    switchMap(([params]) => {
      const query = params.get('q') ?? '';
      const category = params.get('categoria') ?? '';
      const empty = {
        articles: [],
        categories: [],
        pages: [],
        page: 1,
        query,
        category,
        total: 0,
        loading: false,
        error: '',
      };
      return combineLatest([
        this.news.obtenerNoticias(),
        this.news.filtrarPorCategoria(category, query),
      ]).pipe(
        map(([all, filtered]) => {
          const pages = Array.from({ length: Math.ceil(filtered.length / 6) }, (_, i) => i + 1);
          const requested = Number(params.get('pagina') ?? 1);
          const page = Number.isSafeInteger(requested)
            ? Math.max(1, Math.min(requested, pages.length || 1))
            : 1;
          return {
            ...empty,
            articles: filtered.slice((page - 1) * 6, page * 6),
            categories: [...new Set(all.map((article) => article.categoria))],
            pages,
            page,
            total: filtered.length,
          };
        }),
        startWith({ ...empty, loading: true }),
        catchError((error: Error) => of({ ...empty, error: error.message })),
      );
    }),
  );

  protected search(query: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: query || null, pagina: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
  protected category(category: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { categoria: category || null, pagina: null },
      queryParamsHandling: 'merge',
    });
  }
  protected page(page: number): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pagina: page === 1 ? null : page },
      queryParamsHandling: 'merge',
    });
  }
  protected clear(): void {
    void this.router.navigate(['/noticias']);
  }
  protected retry(): void {
    this.reload$.next(this.reload$.value + 1);
  }
}
