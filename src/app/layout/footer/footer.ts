import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterLink {
  label: string;
  path?: string;
}

interface SocialLink {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly currentYear = new Date().getFullYear();

  protected readonly footerLinks: FooterLink[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Noticias', path: '/noticias' },
    { label: 'Categorías', path: '/noticias' },
    { label: 'Contacto', path: '/contacto' },
    { label: 'Acerca de' },
  ];

  protected readonly socialLinks: SocialLink[] = [
    { name: 'Facebook', icon: 'icons/social-circle-facebook.svg' },
    { name: 'Twitter', icon: 'icons/social-circle-twitter.svg' },
    { name: 'Instagram', icon: 'icons/social-circle-instagram.svg' },
    { name: 'LinkedIn', icon: 'icons/social-circle-linkedin.svg' },
  ];

  onSocialLinkClick(social: SocialLink): void {
    console.info(`Enlace social pendiente de implementar: ${social.name}`);
  }

  onLegalLinkClick(label: string): void {
    console.info(`Página legal pendiente de implementar: ${label}`);
  }
}
