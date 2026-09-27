import { Component } from '@angular/core';

interface NavLink {
  label: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  protected readonly navLinks: NavLink[] = [
    { label: 'Inicio', isActive: true },
    { label: 'Noticias' },
    { label: 'Categorías' },
    { label: 'Favoritos' },
    { label: 'Contacto' },
    { label: 'Acerca de' },
  ];

  protected isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onNavLinkClick(link: NavLink): void {
    console.info(`Navegación pendiente de implementar: ${link.label}`);
    this.isMenuOpen = false;
  }

  onSearchClick(): void {
    console.info('Búsqueda pendiente de implementar');
  }

  onLoginClick(): void {
    console.info('Inicio de sesión pendiente de implementar');
  }
}
