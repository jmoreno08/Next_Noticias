import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NewsList } from './pages/news-list/news-list';
import { NewsDetail } from './pages/news-detail/news-detail';
import { NotFound } from './pages/not-found';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full', title: 'Inicio | NEXT Noticias' },
  { path: 'noticias', component: NewsList, title: 'Noticias | NEXT Noticias' },
  { path: 'noticias/:id', component: NewsDetail, title: 'Artículo | NEXT Noticias' },
  { path: '**', component: NotFound, title: 'Página no encontrada | NEXT Noticias' },
];
