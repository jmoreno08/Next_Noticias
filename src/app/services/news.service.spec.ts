import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NewsService } from './news.service';
import { News } from '../models/news';

describe('NewsService', () => {
  let service: NewsService;
  let http: HttpTestingController;
  const articles: News[] = [
    {
      id: 1,
      titulo: 'Educación e inteligencia artificial',
      categoria: 'Educación',
      descripcion: 'Resumen',
      contenido: 'Contenido',
      imagen: 'images/hero-main-image.png',
      fecha: '2026-09-20',
      autor: 'Redacción',
      destacada: true,
    },
    {
      id: 2,
      titulo: 'Nuevas redes digitales',
      categoria: 'Tecnología',
      descripcion: 'Resumen',
      contenido: 'Contenido',
      imagen: 'images/hero-main-image.png',
      fecha: '2026-09-21',
      autor: 'Redacción',
      destacada: false,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NewsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the JSON once and shares it between consumers', () => {
    service.obtenerNoticias().subscribe((result) => expect(result).toEqual(articles));
    service
      .obtenerDestacadas()
      .subscribe((result) => expect(result.map((article) => article.id)).toEqual([1]));
    http.expectOne('data/noticias.json').flush(articles);
    service.obtenerNoticias().subscribe((result) => expect(result).toHaveLength(2));
    http.expectNone('data/noticias.json');
  });

  it('finds an article by ID and returns undefined for a missing article', () => {
    service
      .obtenerNoticiaPorId(2)
      .subscribe((result) => expect(result?.titulo).toBe('Nuevas redes digitales'));
    service.obtenerNoticiaPorId(999).subscribe((result) => expect(result).toBeUndefined());
    http.expectOne('data/noticias.json').flush(articles);
  });

  it('searches titles ignoring accents, case and surrounding spaces', () => {
    service
      .buscarNoticias(' EDUCACION ')
      .subscribe((result) => expect(result.map((article) => article.id)).toEqual([1]));
    service.buscarNoticias('inexistente').subscribe((result) => expect(result).toEqual([]));
    service.buscarNoticias(' ').subscribe((result) => expect(result).toHaveLength(2));
    http.expectOne('data/noticias.json').flush(articles);
  });

  it('combines search and category without searching article descriptions', () => {
    service
      .filtrarPorCategoria('tecnologia', 'redes')
      .subscribe((result) => expect(result.map((article) => article.id)).toEqual([2]));
    service.filtrarPorCategoria('Turismo').subscribe((result) => expect(result).toEqual([]));
    service.buscarNoticias('Resumen').subscribe((result) => expect(result).toEqual([]));
    http.expectOne('data/noticias.json').flush(articles);
  });

  it('reports a friendly loading error and allows a later retry', () => {
    service.obtenerNoticias().subscribe({
      next: () => {
        throw new Error('The failed request must not succeed');
      },
      error: (error: Error) =>
        expect(error.message).toBe('No pudimos cargar las noticias. Inténtalo de nuevo.'),
    });
    http
      .expectOne('data/noticias.json')
      .flush('Unavailable', { status: 503, statusText: 'Unavailable' });
    service.obtenerNoticias().subscribe((result) => expect(result).toEqual(articles));
    http.expectOne('data/noticias.json').flush(articles);
  });

  it('rejects malformed data instead of passing it to the interface', () => {
    service.obtenerNoticias().subscribe({
      next: () => {
        throw new Error('Invalid data must not succeed');
      },
      error: (error: Error) => expect(error.message).toContain('No pudimos cargar'),
    });
    http.expectOne('data/noticias.json').flush([{ id: 1 }]);
  });
});
