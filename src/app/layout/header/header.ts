import { Component, inject } from '@angular/core';
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
  protected readonly navLinks: NavLink[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Noticias', path: '/noticias' },
    { label: 'Favoritos', path: '/favoritos' },
    { label: 'Administración' },
    { label: 'Contacto' },
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
    console.info('Inicio de sesión pendiente de implementar');
  }
}
