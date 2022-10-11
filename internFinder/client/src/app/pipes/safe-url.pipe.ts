import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
  constructor(protected sanitized: DomSanitizer) {}
  transform(url: string) {
    return this.sanitized.bypassSecurityTrustResourceUrl(url);
  }

}

