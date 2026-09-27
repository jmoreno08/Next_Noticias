import { Component } from '@angular/core';
import { Hero } from './hero/hero';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
