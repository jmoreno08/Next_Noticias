import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface Category {
  label: string;
  icon: string;
  active?: boolean;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  styleUrl: './categories.css',
  templateUrl: './categories.html',
})
export class Categories {
  private readonly router = inject(Router);
  protected readonly categories: Category[] = [
    { label: 'Tecnología', icon: 'icons/cpu.svg', active: true },
    { label: 'Educación', icon: 'icons/graduation-cap.svg' },
    { label: 'Turismo', icon: 'icons/globe.svg' },
    { label: 'Negocios', icon: 'icons/newspaper.svg' },
    { label: 'Ciencia e Innovación', icon: 'icons/lightbulb.svg' },
  ];

  onCategoryClick(category: Category): void {
    void this.router.navigate(['/noticias'], { queryParams: { categoria: category.label } });
  }
}
