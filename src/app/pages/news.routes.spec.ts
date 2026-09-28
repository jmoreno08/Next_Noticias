import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { routes } from '../app.routes';
import { News } from '../models/news';

const articles: News[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  titulo: `Educación ${index + 1}`,
  categoria: index < 7 ? 'Educación' : 'Turismo',
  descripcion: 'Resumen',
  contenido: 'Primer párrafo.\n\nSegundo párrafo.',
  imagen: 'images/news/education.png',
  fecha: '2026-09-15',
  autor: 'Redacción',
  destacada: index < 3,
}));

describe('News routes', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('paginates and combines the URL search with the category', async () => {
    const harness = await RouterTestingHarness.create('/noticias');
    http.expectOne('data/noticias.json').flush(articles);
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelectorAll('app-news-card')).toHaveLength(6);
    await harness.navigateByUrl('/noticias?pagina=2');
    expect(harness.routeNativeElement?.querySelectorAll('app-news-card')).toHaveLength(4);
    await harness.navigateByUrl('/noticias?q=educacion&categoria=Turismo');
    expect(harness.routeNativeElement?.querySelectorAll('app-news-card')).toHaveLength(3);
    await harness.navigateByUrl('/noticias?q=inexistente');
    expect(harness.routeNativeElement?.textContent).toContain('No encontramos noticias');
  });

  it('loads details, reacts to a different ID and handles a missing article', async () => {
    const harness = await RouterTestingHarness.create('/noticias/2');
    http.expectOne('data/noticias.json').flush(articles);
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Educación 2');
    expect(harness.routeNativeElement?.textContent).toContain('Segundo párrafo.');
    await harness.navigateByUrl('/noticias/3');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Educación 3');
    await harness.navigateByUrl('/noticias/no-valida');
    expect(harness.routeNativeElement?.textContent).toContain('No encontramos esta noticia');
  });

  it('shows a friendly error and retries the JSON request', async () => {
    const harness = await RouterTestingHarness.create('/noticias');
    http.expectOne('data/noticias.json').flush('Error', { status: 500, statusText: 'Error' });
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('No pudimos cargar');
    harness.routeNativeElement?.querySelector<HTMLButtonElement>('[data-retry]')?.click();
    http.expectOne('data/noticias.json').flush(articles);
    harness.detectChanges();
    expect(harness.routeNativeElement?.querySelectorAll('app-news-card')).toHaveLength(6);
  });

  it('shows a not-found page for an unknown route', async () => {
    const harness = await RouterTestingHarness.create('/ruta-inexistente');
    expect(harness.routeNativeElement?.textContent).toContain('Página no encontrada');
    expect(TestBed.inject(Router).url).toBe('/ruta-inexistente');
  });
});
