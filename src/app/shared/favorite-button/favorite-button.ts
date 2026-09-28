import { Component, inject, input } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  template: `<button
    type="button"
    [class.saved]="favorites.has(id())"
    [class.expanded]="expanded()"
    [attr.aria-pressed]="favorites.has(id())"
    [attr.aria-label]="
      (favorites.has(id()) ? 'Quitar de favoritos: ' : 'Guardar en favoritos: ') + title()
    "
    [title]="favorites.has(id()) ? 'Quitar de favoritos' : 'Guardar en favoritos'"
    (click)="favorites.toggle(id())"
  >
    <img [src]="favorites.has(id()) ? 'icons/heart-saved.svg' : 'icons/heart-off.svg'" alt="" />
    @if (expanded()) {
      <span>{{ favorites.has(id()) ? 'Quitar de favoritos' : 'Guardar artículo' }}</span>
    }
  </button>`,
  styles: `
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: 0;
      border-radius: 50%;
      background: #f8fafc;
      cursor: pointer;
      color: #0f172a;
      font: inherit;
    }
    button.saved {
      background: #fee2e2;
      color: #b91c1c;
    }
    button.expanded {
      width: auto;
      height: auto;
      border-radius: 8px;
      padding: 10px 16px;
      gap: 8px;
      font-size: 14px;
    }
    button:hover {
      box-shadow: 0 0 0 2px #e2e8f0;
    }
    button:focus-visible {
      outline: 2px solid #2563eb;
      outline-offset: 4px;
    }
  `,
})
export class FavoriteButton {
  protected readonly favorites = inject(FavoritesService);
  readonly id = input.required<number>();
  readonly title = input.required<string>();
  readonly expanded = input(false);
}
