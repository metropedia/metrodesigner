import {
  Component,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'toolset',
  template: `
    <button class="btn btn-sm">Implement</button>
  `,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ToolsetComponent {
  constructor() {

  };

  ngAfterViewInit() {
    console.log(123);
  };
};
