import { Component } from '@angular/core';

@Component({
  selector: 'app-latest-news',
  standalone: true,
  templateUrl: './latest-news.html',
  styleUrls: ['./latest-news.css', '../news-images.css'],
})
export class LatestNews {
  protected readonly articles = [
    {
      category: 'Tecnología',
      image: 'quantum',
      title: 'El despegue de la computación cuántica comercial',
      published: 'Hace 2 horas',
    },
    {
      category: 'Educación',
      image: 'scholarships',
      title: 'Nuevas becas de posgrado para ingenierías de software',
      published: 'Hace 5 horas',
    },
    {
      category: 'Turismo',
      image: 'mountains',
      title: 'Rutas de trekking de montaña ganan popularidad mundial',
      published: 'Ayer',
    },
    {
      category: 'Innovación',
      image: 'medicine',
      title: 'Dispositivos médicos impresos en 3D salvan vidas',
      published: 'Hace 2 días',
    },
  ];

  onArticleClick(title: string): void {
    console.info(`Apertura de artículo pendiente de implementar: ${title}`);
  }
}
