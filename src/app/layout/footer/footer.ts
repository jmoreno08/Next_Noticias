import { Component } from '@angular/core';

interface FooterLink {
  label: string;
}

interface SocialLink {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly currentYear = new Date().getFullYear();

  protected readonly footerLinks: FooterLink[] = [
    { label: 'Inicio' },
    { label: 'Noticias' },
    { label: 'Categorías' },
    { label: 'Contacto' },
    { label: 'Acerca de' },
  ];

  protected readonly socialLinks: SocialLink[] = [
    { name: 'Facebook', icon: 'images/social-circle-facebook.svg' },
    { name: 'Twitter', icon: 'images/social-circle-twitter.svg' },
    { name: 'Instagram', icon: 'images/social-circle-instagram.svg' },
    { name: 'LinkedIn', icon: 'images/social-circle-linkedin.svg' },
  ];

  onFooterLinkClick(link: FooterLink): void {
    console.info(`Navegación pendiente de implementar: ${link.label}`);
  }

  onSocialLinkClick(social: SocialLink): void {
    console.info(`Enlace social pendiente de implementar: ${social.name}`);
  }

  onLegalLinkClick(label: string): void {
    console.info(`Página legal pendiente de implementar: ${label}`);
  }
}
