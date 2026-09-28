import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

// Validate meaningful text, not spaces used to meet the minimum length.
function textLength(minimum: number): ValidatorFn {
  return (control) => {
    const value = (control.value as string).trim();
    return !value ? { required: true } : value.length < minimum ? { minlength: true } : null;
  };
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private readonly builder = inject(FormBuilder);
  private readonly formElement = viewChild.required<ElementRef<HTMLFormElement>>('formElement');
  protected readonly sent = signal(false);
  readonly form = this.builder.nonNullable.group({
    nombre: ['', textLength(3)],
    correo: [
      '',
      [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)],
    ],
    asunto: ['', textLength(1)],
    mensaje: ['', textLength(10)],
  });

  protected error(field: keyof typeof this.form.controls): string {
    const control = this.form.controls[field];
    if (!control.touched || control.valid) return '';
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (field === 'nombre') return 'El nombre debe tener al menos 3 caracteres.';
    if (field === 'correo') return 'Por favor introduce un correo electrónico válido.';
    if (field === 'mensaje') return 'El mensaje debe tener al menos 10 caracteres.';
    return '';
  }

  protected submit(directive: FormGroupDirective): void {
    this.sent.set(false);
    const values = this.form.getRawValue();
    this.form.setValue({
      nombre: values.nombre.trim(),
      correo: values.correo.trim(),
      asunto: values.asunto.trim(),
      mensaje: values.mensaje.trim(),
    });
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formElement()
        .nativeElement.querySelector<HTMLElement>('input.ng-invalid, textarea.ng-invalid')
        ?.focus();
      return;
    }
    // Academic prototype: confirmation only, no request or personal-data storage.
    directive.resetForm({ nombre: '', correo: '', asunto: '', mensaje: '' });
    this.sent.set(true);
  }
}
