import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { News } from '../models/news';

export function validImage(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}
export function validDate(value: string): boolean {
  const date = new Date(value);
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}
function validDraft(value: Omit<News, 'id'>): boolean {
  return (
    ['titulo', 'categoria', 'descripcion', 'contenido', 'autor'].every((key) => {
      const text = value[key as keyof typeof value];
      return typeof text === 'string' && text.trim().length > 0;
    }) &&
    typeof value.destacada === 'boolean' &&
    validImage(value.imagen) &&
    validDate(value.fecha)
  );
}

@Injectable({ providedIn: 'root' })
export class LocalNewsService {
  private readonly key = 'next-noticias:local-news';
  private readonly state = signal<News[]>([]);
  readonly articles = this.state.asReadonly();
  readonly error = signal('');
  private readonly changes = new BehaviorSubject<News[]>([]);
  readonly articles$ = this.changes.asObservable();

  constructor() {
    try {
      const data: unknown = JSON.parse(localStorage.getItem(this.key) ?? '[]');
      if (
        !Array.isArray(data) ||
        !data.every(
          (item) => item && Number.isSafeInteger(item.id) && item.id > 0 && validDraft(item),
        ) ||
        new Set(data.map((item) => item.id)).size !== data.length
      )
        throw new Error('Invalid data');
      this.state.set(data);
      this.changes.next(data);
    } catch {
      this.error.set(
        'No pudimos recuperar las noticias locales. Comprueba el almacenamiento de tu navegador.',
      );
    }
  }

  create(draft: Omit<News, 'id'>, reservedIds: number[] = []): boolean {
    if (!validDraft(draft)) {
      this.error.set('Revisa los campos, la fecha y la URL HTTPS de la imagen.');
      return false;
    }
    const used = new Set([...reservedIds, ...this.state().map((item) => item.id)]);
    let id = Date.now();
    while (used.has(id)) id++;
    return this.save([{ ...draft, id }, ...this.state()]);
  }

  remove(id: number): boolean {
    if (!this.state().some((item) => item.id === id)) return false;
    return this.save(this.state().filter((item) => item.id !== id));
  }

  private save(articles: News[]): boolean {
    try {
      localStorage.setItem(this.key, JSON.stringify(articles));
      this.state.set(articles);
      this.changes.next(articles);
      this.error.set('');
      return true;
    } catch {
      this.error.set(
        'No se guardaron los cambios. Comprueba el espacio y los permisos del almacenamiento.',
      );
      return false;
    }
  }
}
