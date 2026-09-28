import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NewsList } from './pages/news-list/news-list';
import { NewsDetail } from './pages/news-detail/news-detail';
import { NotFound } from './pages/not-found';
import { Favorites } from './pages/favorites/favorites';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full', title: 'Inicio | NEXT Noticias' },
  { path: 'noticias', component: NewsList, title: 'Noticias | NEXT Noticias' },
  { path: 'noticias/:id', component: NewsDetail, title: 'Artículo | NEXT Noticias' },
  { path: 'favoritos', component: Favorites, title: 'Favoritos | NEXT Noticias' },
  { path: '**', component: NotFound, title: 'Página no encontrada | NEXT Noticias' },
];
