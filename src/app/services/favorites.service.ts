import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'next-noticias:favorites';
const validId = (id: unknown): id is number =>
  typeof id === 'number' && Number.isSafeInteger(id) && id > 0;

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly savedIds = signal<readonly number[]>([]);
  private readonly storageError = signal('');
  readonly ids = this.savedIds.asReadonly();
  readonly error = this.storageError.asReadonly();

  constructor() {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      if (!Array.isArray(stored)) throw new Error('Invalid favorites');
      this.savedIds.set([...new Set(stored.filter(validId))]);
    } catch {
      this.storageError.set(
        'No pudimos leer tus favoritos guardados. Puedes intentar guardarlos de nuevo.',
      );
    }
  }

  has(id: number): boolean {
    return this.ids().includes(id);
  }

  add(id: number): void {
    if (validId(id) && !this.has(id)) this.save([...this.ids(), id]);
  }

  remove(id: number): void {
    if (this.has(id)) this.save(this.ids().filter((saved) => saved !== id));
  }

  toggle(id: number): void {
    this.has(id) ? this.remove(id) : this.add(id);
  }

  private save(ids: readonly number[]): void {
    try {
      // Only update the interface after persistence succeeds.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      this.savedIds.set(ids);
      this.storageError.set('');
    } catch {
      this.storageError.set(
        'No pudimos guardar el cambio en favoritos. Revisa el almacenamiento del navegador e inténtalo de nuevo.',
      );
    }
  }
}
