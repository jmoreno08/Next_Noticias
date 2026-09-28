import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { News } from '../models/news';

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function isNews(value: unknown): value is News {
  if (!value || typeof value !== 'object') return false;
  const article = value as Record<string, unknown>;
  const textFields = [
    'titulo',
    'categoria',
    'descripcion',
    'contenido',
    'imagen',
    'fecha',
    'autor',
  ];
  return (
    Number.isSafeInteger(article['id']) &&
    Number(article['id']) > 0 &&
    typeof article['destacada'] === 'boolean' &&
    textFields.every(
      (field) => typeof article[field] === 'string' && article[field].trim().length > 0,
    )
  );
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly http = inject(HttpClient);

  // A relative URL also works when the app is hosted under /Next_Noticias/.
  // Cache successful loads; shareReplay resets after an error so callers can retry.
  private readonly news$ = this.http.get<unknown>('data/noticias.json').pipe(
    map((data) => {
      if (
        !Array.isArray(data) ||
        !data.every(isNews) ||
        new Set(data.map((article) => article.id)).size !== data.length
      ) {
        throw new Error('Invalid news data');
      }
      return data as News[];
    }),
    catchError(() =>
      throwError(() => new Error('No pudimos cargar las noticias. Inténtalo de nuevo.')),
    ),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  obtenerNoticias(): Observable<News[]> {
    return this.news$;
  }

  obtenerNoticiaPorId(id: number): Observable<News | undefined> {
    return this.news$.pipe(map((articles) => articles.find((article) => article.id === id)));
  }

  obtenerDestacadas(): Observable<News[]> {
    return this.news$.pipe(map((articles) => articles.filter((article) => article.destacada)));
  }

  buscarNoticias(titulo: string): Observable<News[]> {
    return this.filtrarPorCategoria('', titulo);
  }

  filtrarPorCategoria(categoria: string, titulo = ''): Observable<News[]> {
    const category = normalize(categoria);
    const query = normalize(titulo);
    return this.news$.pipe(
      map((articles) =>
        articles.filter(
          (article) =>
            (!category || category === 'todas' || normalize(article.categoria) === category) &&
            normalize(article.titulo).includes(query),
        ),
      ),
    );
  }
}
