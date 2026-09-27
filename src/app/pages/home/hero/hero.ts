import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {
  protected readonly featured = {
    label: 'Destacado del Día',
    title: 'La revolución de la infraestructura digital global',
    description:
      'Cómo la nube y las redes ultrarrápidas están tejiendo las conexiones del futuro cercano.',
  };

  onExploreClick(): void {
    console.info('Navegación a noticias pendiente de implementar');
  }

  onReadFeaturedClick(): void {
    console.info(`Apertura de artículo pendiente de implementar: ${this.featured.title}`);
  }
}
