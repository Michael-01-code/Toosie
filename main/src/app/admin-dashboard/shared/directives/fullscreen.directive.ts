import { Directive, HostListener } from '@angular/core';
import ScreenFull from 'screenfull';

@Directive({
  selector: '[toggleFullscreen]'
})
export class ToggleFullscreenDirective {

  @HostListener('click') onClick() {
    if (ScreenFull.isEnabled) {
      ScreenFull.toggle();
    }
  }
}
