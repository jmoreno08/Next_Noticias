import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the home news sections between categories and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('La actualidad que te conecta');
    expect(compiled.querySelectorAll('app-featured-news article')).toHaveLength(3);
    expect(compiled.querySelectorAll('app-latest-news article')).toHaveLength(4);
    const sections = Array.from(
      compiled.querySelectorAll('app-categories, app-featured-news, app-latest-news, app-footer'),
    );
    expect(sections.map((section) => section.tagName.toLowerCase())).toEqual([
      'app-categories',
      'app-featured-news',
      'app-latest-news',
      'app-footer',
    ]);
  });
});
