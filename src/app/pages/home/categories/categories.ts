import { Component } from '@angular/core';

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
  protected readonly categories: Category[] = [
    { label: 'Tecnología', icon: 'icons/cpu.svg', active: true },
    { label: 'Educación', icon: 'icons/graduation-cap.svg' },
    { label: 'Turismo', icon: 'icons/globe.svg' },
    { label: 'Actualidad', icon: 'icons/newspaper.svg' },
    { label: 'Innovación', icon: 'icons/lightbulb.svg' },
  ];

  onCategoryClick(category: Category): void {
    console.info(`Filtro de categoría pendiente de implementar: ${category.label}`);
  }
}
