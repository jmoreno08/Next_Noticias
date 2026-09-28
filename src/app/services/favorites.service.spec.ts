import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';

const key = 'next-noticias:favorites';

describe('FavoritesService', () => {
  beforeEach(() => {
    localStorage.removeItem(key);
    TestBed.configureTestingModule({});
  });
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.removeItem(key);
  });

  it('adds once, persists and removes favorites', () => {
    const service = TestBed.inject(FavoritesService);
    service.add(2);
    service.add(2);
    service.add(3);
    expect(service.ids()).toEqual([2, 3]);
    expect(JSON.parse(localStorage.getItem(key)!)).toEqual([2, 3]);
    service.remove(2);
    expect(service.has(2)).toBe(false);
    expect(JSON.parse(localStorage.getItem(key)!)).toEqual([3]);
    service.toggle(3);
    expect(service.ids()).toEqual([]);
  });

  it('restores saved IDs in a new service instance', () => {
    localStorage.setItem(key, '[2,3]');
    expect(TestBed.inject(FavoritesService).ids()).toEqual([2, 3]);
  });

  it('ignores duplicates and invalid IDs from storage and method calls', () => {
    localStorage.setItem(key, '[2,2,"3",null,-1,1.5]');
    const service = TestBed.inject(FavoritesService);
    expect(service.ids()).toEqual([2]);
    service.add(NaN);
    service.add(-1);
    expect(service.ids()).toEqual([2]);
  });

  it('handles corrupted storage and recovers on the next save', () => {
    localStorage.setItem(key, '{bad json');
    const service = TestBed.inject(FavoritesService);
    expect(service.ids()).toEqual([]);
    expect(service.error()).toBeTruthy();
    service.add(1);
    expect(service.error()).toBe('');
    expect(service.ids()).toEqual([1]);
  });

  it('does not claim a change succeeded if persistence fails', () => {
    localStorage.setItem(key, '[2]');
    const service = TestBed.inject(FavoritesService);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    service.remove(2);
    expect(service.ids()).toEqual([2]);
    expect(service.error()).toContain('No pudimos guardar');
  });

  it('handles unavailable storage without crashing', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    const service = TestBed.inject(FavoritesService);
    expect(service.ids()).toEqual([]);
    expect(service.error()).toContain('No pudimos leer');
  });
});
