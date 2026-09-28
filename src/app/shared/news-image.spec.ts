import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NewsImage } from './news-image';

@Component({ imports: [NewsImage], template: '<img appNewsImage [src]="source" />' })
class Host {
  source = 'https://example.com/missing.jpg';
}

describe('NewsImage', () => {
  it('uses the local fallback without looping and handles a later source failure', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const image: HTMLImageElement = fixture.nativeElement.querySelector('img');
    image.dispatchEvent(new Event('error'));
    expect(image.src).toBe(new URL('images/news-placeholder.svg', document.baseURI).href);
    const setter = vi.spyOn(image, 'src', 'set');
    image.dispatchEvent(new Event('error'));
    expect(setter).not.toHaveBeenCalled();
    fixture.componentInstance.source = 'https://example.com/other.jpg';
    fixture.detectChanges();
    image.dispatchEvent(new Event('error'));
    expect(image.src).toContain('news-placeholder.svg');
  });
});
