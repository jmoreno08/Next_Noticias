import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  label: string;
  path?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
  protected readonly navLinks = computed(() =>
    this.links.filter((link) => link.path !== '/administracion' || this.auth.isAdmin()),
  );
  private readonly links: NavLink[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Noticias', path: '/noticias' },
    { label: 'Favoritos', path: '/favoritos' },
    { label: 'Administración', path: '/administracion' },
    { label: 'Contacto', path: '/contacto' },
  ];

  protected isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onNavLinkClick(): void {
    this.isMenuOpen = false;
  }

  onSearchClick(): void {
    this.isMenuOpen = false;
    void this.router.navigate(['/noticias']);
  }

  onLoginClick(): void {
    this.isMenuOpen = false;
    if (this.auth.isAdmin()) {
      this.auth.logout();
      void this.router.navigate(['/']);
    } else {
      void this.router.navigate(['/login']);
    }
  }
}
