import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { routes } from '../app.routes';

describe('Demo session', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });
  });
  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });
  it('rejects wrong credentials and persists only the demo marker', () => {
    const auth = TestBed.inject(AuthService);
    expect(auth.login(auth.demoEmail, 'wrong')).toBe(false);
    expect(auth.isAdmin()).toBe(false);
    expect(auth.login(auth.demoEmail, auth.demoPassword)).toBe(true);
    expect(sessionStorage.getItem('next-noticias:demo-session')).toBe('admin-demo');
    const restored = new AuthService();
    expect(restored.isAdmin()).toBe(true);
    restored.logout();
    expect(new AuthService().isAdmin()).toBe(false);
  });
  it('does not authenticate when session storage is unavailable', () => {
    const auth = TestBed.inject(AuthService);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied');
    });
    expect(auth.login(auth.demoEmail, auth.demoPassword)).toBe(false);
    expect(auth.isAdmin()).toBe(false);
    expect(auth.error()).toContain('No se pudo');
  });
  it('redirects direct admin access to login and allows an authenticated admin', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/administracion');
    expect(TestBed.inject(Router).url).toContain('/login?returnUrl=');
    expect(harness.routeNativeElement?.textContent).toContain('Cuenta de prueba');
    const auth = TestBed.inject(AuthService);
    auth.login(auth.demoEmail, auth.demoPassword);
    await harness.navigateByUrl('/administracion');
    expect(TestBed.inject(Router).url).toBe('/administracion');
    auth.logout();
    await harness.navigateByUrl('/');
    await harness.navigateByUrl('/administracion');
    expect(TestBed.inject(Router).url).toContain('/login?returnUrl=');
  });
});
