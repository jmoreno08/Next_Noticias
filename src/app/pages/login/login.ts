import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: ` <main>
    <h1>Iniciar sesión</h1>
    <p>Acceso de demostración para administrar noticias locales.</p>
    <aside>
      <strong>Cuenta de prueba</strong><br />Correo: {{ auth.demoEmail }}<br />Contraseña:
      {{ auth.demoPassword }}
    </aside>
    <p class="note">
      Simulación académica sin backend. Utiliza únicamente estas credenciales de prueba.
    </p>
    <form [formGroup]="form" (ngSubmit)="submit(element)" #element novalidate>
      <label for="login-email">Correo electrónico</label>
      <input
        id="login-email"
        type="email"
        formControlName="email"
        autocomplete="username"
        [attr.aria-invalid]="form.controls.email.touched && form.controls.email.invalid"
        aria-describedby="email-error"
      />
      <span id="email-error">
        @if (form.controls.email.touched && form.controls.email.invalid) {
          Introduce un correo válido.
        }
      </span>
      <label for="login-password">Contraseña</label>
      <input
        id="login-password"
        type="password"
        formControlName="password"
        autocomplete="current-password"
        [attr.aria-invalid]="form.controls.password.touched && form.controls.password.invalid"
        aria-describedby="password-error"
      />
      <span id="password-error">
        @if (form.controls.password.touched && form.controls.password.invalid) {
          Introduce la contraseña.
        }
      </span>
      <button type="submit">Entrar</button>
    </form>
  </main>`,
  styles: `
    :host {
      display: block;
      color: #0f172a;
    }
    main {
      max-width: 460px;
      margin: 48px auto;
      padding: 24px;
    }
    h1 {
      font-size: 30px;
    }
    p {
      line-height: 1.6;
      color: #475569;
    }
    aside {
      background: #eff6ff;
      padding: 18px;
      border-radius: 12px;
      line-height: 1.8;
      overflow-wrap: anywhere;
    }
    .note {
      font-size: 13px;
    }
    form {
      display: grid;
      gap: 10px;
      margin-top: 24px;
    }
    label {
      font-weight: 600;
    }
    input,
    button {
      box-sizing: border-box;
      width: 100%;
      padding: 13px;
      border-radius: 8px;
      font: inherit;
    }
    input {
      border: 1px solid #cbd5e1;
      min-width: 0;
    }
    button {
      border: 0;
      background: #2563eb;
      color: white;
      cursor: pointer;
      margin-top: 10px;
    }
    span {
      color: #b91c1c;
      font-size: 13px;
    }
    input[aria-invalid='true'] {
      border-color: #b91c1c;
    }
    input:focus-visible,
    button:focus-visible {
      outline: 3px solid #93c5fd;
      outline-offset: 2px;
    }
  `,
})
export class Login {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected submit(element: HTMLFormElement): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      element.querySelector<HTMLElement>('.ng-invalid')?.focus();
      return;
    }
    const { email, password } = this.form.getRawValue();
    if (this.auth.login(email, password)) {
      this.form.controls.password.reset();
      const target = this.route.snapshot.queryParamMap.get('returnUrl');
      // Only the protected destination is accepted; never redirect to arbitrary URLs.
      void this.router.navigateByUrl(
        target && /^\/administracion(?:[?#]|$)/.test(target) ? target : '/administracion',
      );
    }
  }
}
