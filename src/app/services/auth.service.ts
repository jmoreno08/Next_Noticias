import { Injectable, signal } from '@angular/core';

/** Public demo account, not a security boundary or production authentication. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly demoEmail = 'admin@nextnoticias.demo';
  readonly demoPassword = 'DemoNoticias2026';
  private readonly key = 'next-noticias:demo-session';
  private readonly authenticated = signal(false);
  readonly isAdmin = this.authenticated.asReadonly();
  readonly error = signal('');
  constructor() {
    try {
      this.authenticated.set(sessionStorage.getItem(this.key) === 'admin-demo');
    } catch {
      this.error.set('No se puede acceder al almacenamiento de sesión.');
    }
  }
  login(email: string, password: string): boolean {
    this.error.set('');
    if (email.trim().toLowerCase() !== this.demoEmail || password !== this.demoPassword) {
      this.error.set('Correo o contraseña incorrectos. Usa la cuenta de demostración.');
      return false;
    }
    try {
      sessionStorage.setItem(this.key, 'admin-demo');
      this.authenticated.set(true);
      return true;
    } catch {
      this.error.set('No se pudo guardar la sesión. Revisa los permisos del navegador.');
      return false;
    }
  }
  logout(): void {
    this.authenticated.set(false);
    this.error.set('');
    try {
      sessionStorage.removeItem(this.key);
    } catch {
      this.error.set(
        'La sesión se cerró en esta página, pero no pudo borrarse del navegador. Cierra esta pestaña.',
      );
    }
  }
}
