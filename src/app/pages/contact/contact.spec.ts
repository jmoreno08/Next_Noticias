import { TestBed } from '@angular/core/testing';
import { Contact } from './contact';

describe('Contact', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [Contact] }));

  it('shows required errors only after interaction and focuses the first invalid field', async () => {
    const fixture = TestBed.createComponent(Contact);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.field-error')).toHaveLength(0);
    element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await fixture.whenStable();
    expect(element.querySelectorAll('.field-error')).toHaveLength(4);
    expect(element.querySelector('[role="status"]')).toBeNull();
    expect(document.activeElement?.id).toBe('contact-name');
  });

  it('rejects short, blank and invalid values', () => {
    const form = TestBed.createComponent(Contact).componentInstance.form;
    form.setValue({ nombre: 'Al', correo: 'juan@noticias', asunto: '   ', mensaje: 'Corto' });
    expect(form.controls.nombre.invalid).toBe(true);
    expect(form.controls.correo.invalid).toBe(true);
    expect(form.controls.asunto.invalid).toBe(true);
    expect(form.controls.mensaje.invalid).toBe(true);
    form.controls.nombre.setValue('   ');
    form.controls.mensaje.setValue('          ');
    expect(form.controls.nombre.hasError('required')).toBe(true);
    expect(form.controls.mensaje.hasError('required')).toBe(true);
  });

  it('confirms a valid submission and resets the form without storing the message', async () => {
    const fixture = TestBed.createComponent(Contact);
    await fixture.whenStable();
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem');
    fixture.componentInstance.form.setValue({
      nombre: 'Ana',
      correo: 'ana@example.com',
      asunto: 'Consulta',
      mensaje: 'Un mensaje de prueba.',
    });
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await fixture.whenStable();
    expect(element.querySelector('[role="status"]')?.textContent).toContain(
      'Tu mensaje ha sido enviado correctamente.',
    );
    expect(fixture.componentInstance.form.getRawValue()).toEqual({
      nombre: '',
      correo: '',
      asunto: '',
      mensaje: '',
    });
    expect(element.querySelectorAll('.field-error')).toHaveLength(0);
    expect(storageSpy).not.toHaveBeenCalled();
    storageSpy.mockRestore();
    const input = element.querySelector<HTMLInputElement>('input')!;
    input.value = 'Nuevo mensaje';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    expect(element.querySelector('[role="status"]')).toBeNull();
  });
});
