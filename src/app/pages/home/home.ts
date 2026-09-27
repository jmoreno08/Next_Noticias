import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { Categories } from './categories/categories';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, Categories],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
