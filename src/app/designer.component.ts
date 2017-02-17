import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
var Metro = require("../vendor/metrojs/metro").Metro;

@Component({
  selector: 'metro-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DesignerComponent {
  title = 'Metro Designer';
  app = {
    canvasWidth: <number> null,
    canvasHeight: <number> null
  };

  @ViewChild('container') container:ElementRef;

  ngAfterViewInit() {

    let def = {
      pointerRadius: 10,
      width: 800,
      height: 500,
      resolution: 20,
      container: this.container.nativeElement,
      inputMode: 'draw',
      pathType: 'straight',
    };
    console.log(def);

    let metro = new Metro(def);

    this.app.canvasWidth = metro.width;
    this.app.canvasHeight = metro.height

  }
}
