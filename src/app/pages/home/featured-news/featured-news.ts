import { Component } from '@angular/core';

@Component({
  selector: 'app-featured-news',
  standalone: true,
  templateUrl: './featured-news.html',
  styleUrls: ['./featured-news.css', '../news-images.css'],
})
export class FeaturedNews {
  protected readonly articles = [
    {
      category: 'Educación',
      image: 'education',
      title: 'La inteligencia artificial transforma la educación',
      description:
        'Aulas modernas adoptan asistentes inteligentes para personalizar la experiencia de aprendizaje de cada estudiante en tiempo real.',
    },
    {
      category: 'Turismo',
      image: 'tourism',
      title: 'Ecuador: un destino que conquista al mundo',
      description:
        'Desde las majestuosas Islas Galápagos hasta el centro histórico de Quito, el país andino se consolida como el epicentro de conservación y ecoturismo.',
    },
    {
      category: 'Innovación',
      image: 'innovation',
      title: 'Universidades impulsan la innovación en el país',
      description:
        'Alianzas estratégicas entre la academia y las industrias tecnológicas aceleran la creación de patentes locales y soluciones de robótica aplicada.',
    },
  ];

  onArticleClick(title: string): void {
    console.info(`Apertura de artículo pendiente de implementar: ${title}`);
  }

  onFavoriteClick(title: string): void {
    console.info(`Guardar favorito pendiente de implementar: ${title}`);
  }

  onViewAllClick(): void {
    console.info('Listado de noticias pendiente de implementar');
  }
}
