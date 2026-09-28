import { Directive, ElementRef, inject } from '@angular/core';

/** Use a local illustration when an article image cannot be loaded. */
@Directive({ selector: 'img[appNewsImage]', host: { '(error)': 'onError()' } })
export class NewsImage {
  private readonly element = inject<ElementRef<HTMLImageElement>>(ElementRef);
  protected onError(): void {
    const image = this.element.nativeElement;
    const fallback = new URL('images/news-placeholder.svg', document.baseURI).href;
    // If the fallback itself fails, do not trigger an endless request loop.
    if (image.src !== fallback) image.src = fallback;
  }
}
