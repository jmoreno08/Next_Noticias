import { Component, inject } from '@angular/core';
import { FavoritesService } from './services/favorites.service';
import { LocalNewsService } from './services/local-news.service';
import { AuthService } from './services/auth.service';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';

@Component({
  imports: [RouterOutlet, Header, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly auth = inject(AuthService);
  protected readonly favorites = inject(FavoritesService);
  protected readonly localNews = inject(LocalNewsService);
}
