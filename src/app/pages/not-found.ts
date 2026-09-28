import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template:
    '<main><h1>Página no encontrada</h1><p>El enlace no corresponde a una página disponible.</p><a routerLink="/">Volver al inicio</a></main>',
  styles:
    'main { padding: 64px 24px; min-height: 40vh; text-align: center; color: #0f172a; } a { color: #2563eb; }',
})
export class NotFound {}
