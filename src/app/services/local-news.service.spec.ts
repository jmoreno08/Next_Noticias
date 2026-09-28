import { TestBed } from '@angular/core/testing';
import { LocalNewsService } from './local-news.service';

describe('LocalNewsService', () => {
  const draft = {
    titulo: 'Nueva noticia',
    categoria: 'Tecnología',
    descripcion: 'Resumen',
    contenido: 'Contenido completo',
    imagen: 'https://example.com/photo.jpg',
    fecha: '2026-09-28',
    autor: 'Redacción',
    destacada: true,
  };
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });
  it('creates unique articles, restores them and deletes only local articles', () => {
    const service = TestBed.inject(LocalNewsService);
    expect(service.create(draft)).toBe(true);
    expect(service.create(draft)).toBe(true);
    const ids = service.articles().map((article) => article.id);
    expect(new Set(ids).size).toBe(2);
    const restored = new LocalNewsService();
    expect(restored.articles()).toHaveLength(2);
    expect(restored.remove(1)).toBe(false);
    expect(restored.remove(ids[0])).toBe(true);
    expect(new LocalNewsService().articles()).toHaveLength(1);
  });
  it('rejects unsafe images and invalid dates', () => {
    const service = TestBed.inject(LocalNewsService);
    expect(service.create({ ...draft, imagen: 'javascript:alert(1)' })).toBe(false);
    expect(service.create({ ...draft, fecha: '2026-02-30' })).toBe(false);
    expect(service.articles()).toEqual([]);
  });
  it('preserves state when storage fails and reports corrupt storage', () => {
    localStorage.setItem('next-noticias:local-news', '{');
    const service = TestBed.inject(LocalNewsService);
    expect(service.error()).toBeTruthy();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(service.create(draft)).toBe(false);
    expect(service.articles()).toEqual([]);
  });
});
