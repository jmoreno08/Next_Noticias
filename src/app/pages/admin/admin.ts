import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LocalNewsService, validDate, validImage } from '../../services/local-news.service';
import { NewsService } from '../../services/news.service';

const requiredText: ValidatorFn = (control) =>
  typeof control.value === 'string' && control.value.trim() ? null : { required: true };

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  protected readonly local = inject(LocalNewsService);
  private readonly news = inject(NewsService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly ready = signal(false);
  protected readonly loadError = signal('');
  protected readonly message = signal('');
  private reservedIds: number[] = [];
  readonly categories = ['Tecnología', 'Educación', 'Turismo', 'Negocios', 'Ciencia e Innovación'];
  readonly fields = [
    { key: 'titulo', label: 'Título de la noticia', type: 'text', wide: false },
    { key: 'descripcion', label: 'Descripción corta', type: 'textarea', wide: true },
    { key: 'contenido', label: 'Contenido completo', type: 'textarea', wide: true },
    { key: 'imagen', label: 'URL de la imagen', type: 'url', wide: false },
    { key: 'autor', label: 'Autor', type: 'text', wide: false },
    { key: 'fecha', label: 'Fecha de publicación', type: 'date', wide: false },
  ] as const;
  readonly form = inject(FormBuilder).nonNullable.group({
    titulo: ['', requiredText],
    categoria: ['Tecnología', requiredText],
    descripcion: ['', requiredText],
    contenido: ['', requiredText],
    imagen: [
      '',
      (control: AbstractControl) => (validImage(control.value) ? null : { image: true }),
    ],
    autor: ['', requiredText],
    fecha: ['', (control: AbstractControl) => (validDate(control.value) ? null : { date: true })],
    destacada: false,
  });
  constructor() {
    this.load();
  }
  protected load(): void {
    this.loadError.set('');
    this.news
      .obtenerNoticias()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (articles) => {
          this.reservedIds = articles.map((article) => article.id);
          this.ready.set(true);
        },
        error: () =>
          this.loadError.set(
            'No pudimos cargar el catálogo. Reintenta antes de crear una noticia.',
          ),
      });
  }
  protected error(key: keyof typeof this.form.controls): string {
    const control = this.form.controls[key];
    if (!control.touched || control.valid) return '';
    return key === 'imagen'
      ? 'Introduce una URL de imagen HTTPS válida.'
      : key === 'fecha'
        ? 'Introduce una fecha válida.'
        : 'Este campo es obligatorio.';
  }
  protected submit(directive: FormGroupDirective, element: HTMLFormElement): void {
    this.message.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      element.querySelector<HTMLElement>('.ng-invalid')?.focus();
      return;
    }
    if (!this.ready()) return;
    const value = this.form.getRawValue();
    const draft = {
      ...value,
      titulo: value.titulo.trim(),
      descripcion: value.descripcion.trim(),
      contenido: value.contenido.trim(),
      autor: value.autor.trim(),
    };
    if (this.local.create(draft, this.reservedIds)) {
      directive.resetForm({
        titulo: '',
        categoria: 'Tecnología',
        descripcion: '',
        contenido: '',
        imagen: '',
        autor: '',
        fecha: '',
        destacada: false,
      });
      this.message.set('La noticia se ha creado correctamente.');
    }
  }
  protected remove(id: number): void {
    this.message.set('');
    if (this.local.remove(id)) this.message.set('La noticia se ha eliminado.');
  }
}
