import { Component, ViewChild, ElementRef, ViewEncapsulation, NgZone } from '@angular/core';
let Metro = require("../vendor/metrojs/metro").Metro;
let metro = null;

interface App {
  canvasWidth?: number;
  canvasHeight?: number;
  inputMode?: string;
  pathType?: string;
  metroLines: any[];
  currentEditJoint: any;
  scalePercentage: number;
}

@Component({
  selector: 'metro-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DesignerComponent {
  public title: string = 'Metro Designer';
  public app: App = {
    metroLines: [],
    currentEditJoint: null,
    scalePercentage: 100.00,
  };
  constructor(private zone: NgZone) {}

  @ViewChild('container') container:ElementRef;

  ngAfterViewInit() {
    let self = this;
    let app = this.app;
    let def = {
      pointerRadius: 10,
      width: 800,
      height: 500,
      resolution: 20,
      container: this.container.nativeElement,
      inputMode: 'draw',
      pathType: 'straight',
    };
    metro = new Metro(def);
    metro.on('zooming', function(transform) {
      self.zone.run(() => {
        app.scalePercentage = parseFloat((transform.k * 100).toFixed(2));
      });
    });

    app.inputMode = metro.getInputMode();
    app.pathType = metro.getPathType();
    app.canvasWidth = metro.width;
    app.canvasHeight = metro.height;

  }

  newMetroLine() {
    const metroLine = metro.addMetroLine();
    metro.setCurrentMetroLine(metroLine);
    this.app.metroLines = metro.getMetroLines();
  };

  draw() {
    this.app.inputMode = metro.setInputMode('draw');
    const el = metro.getElements();
    el.pointer.
      classed('hide', false)
    ;
    el.shade.
      classed('hide', false)
    ;
    el.svg.
      classed('input-mode-select', false)
    ;
  };

  editMetroLine() {
    this.app.inputMode = metro.setInputMode('edit');
    var el = metro.getElements();
    el.pointer.
      classed('hide', true)
    ;
    el.shade.
      classed('hide', true)
    ;
    el.svg.
      classed('input-mode-select', true)
    ;
  };

  zoomIn() {
    metro.zoomIn(1.5);
  }; 

  zoomOut() {
    metro.zoomOut(0.75);
  }; 

  center(x, y, k) {
    metro.center(null, null, 1);
  }; 
}
