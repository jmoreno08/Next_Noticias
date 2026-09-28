import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from '../../app.routes';
import { NewsService } from '../../services/news.service';
import { FavoritesService } from '../../services/favorites.service';

describe('Favorites page', () => {
  const article = {
    id: 2,
    titulo: 'Noticia guardada',
    categoria: 'Educación',
    descripcion: 'Resumen',
    contenido: 'Contenido',
    imagen: 'images/news/education.png',
    fecha: '2026-09-15',
    autor: 'Redacción',
    destacada: true,
  };
  beforeEach(() => {
    localStorage.removeItem('next-noticias:favorites');
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: NewsService, useValue: { obtenerNoticias: () => of([article]) } },
      ],
    });
  });
  afterEach(() => localStorage.removeItem('next-noticias:favorites'));

  it('shows saved articles, excludes missing IDs and updates after removal', async () => {
    const favorites = TestBed.inject(FavoritesService);
    favorites.add(2);
    favorites.add(999);
    const harness = await RouterTestingHarness.create('/favoritos');
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('1 noticia guardada');
    expect(harness.routeNativeElement?.querySelectorAll('app-news-card')).toHaveLength(1);
    harness.routeNativeElement
      ?.querySelector<HTMLButtonElement>('app-favorite-button button')
      ?.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Aún no tienes noticias guardadas.');
    expect(favorites.has(2)).toBe(false);
  });

  it('saves from detail and reflects the same state on the favorites page', async () => {
    const harness = await RouterTestingHarness.create('/noticias/2');
    const button = harness.routeNativeElement?.querySelector<HTMLButtonElement>(
      'app-favorite-button button',
    );
    expect(button?.getAttribute('aria-pressed')).toBe('false');
    button?.click();
    harness.detectChanges();
    expect(button?.getAttribute('aria-pressed')).toBe('true');
    await harness.navigateByUrl('/favoritos');
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Noticia guardada');
  });
});
