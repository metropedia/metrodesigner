import { Component, ViewChild, ElementRef, ViewEncapsulation, NgZone } from '@angular/core';
let Metro = require("../vendor/metrojs/metro").Metro;
let metro = null;

interface Line {
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
};

interface Joint {
  data: Line;
};

interface App {
  canvasWidth?: number;
  canvasHeight?: number;
  inputMode?: string;
  pathType?: string;
  metroLines: any[];
  currentEditJoint: Joint;
  scalePercentage: number;
};

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
    currentEditJoint: { data: {} },
    scalePercentage: 100.00,
  };
  constructor(private zone: NgZone) {};

  @ViewChild('container') container:ElementRef;

  ngAfterViewInit(): void {
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

  newMetroLine(): void {
    const metroLine = metro.addMetroLine();
    metro.setCurrentMetroLine(metroLine);
    this.app.metroLines = metro.getMetroLines();
  };

  draw(): void {
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

  editMetroLine(): void {
    this.app.inputMode = metro.setInputMode('edit');
    let el = metro.getElements();
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

  zoomIn(): void {
    metro.zoomIn(1.5);
  }; 

  zoomOut(): void {
    metro.zoomOut(0.75);
  }; 

  center(x, y, k): void {
    metro.center(null, null, 1);
  }; 

  useStraightPath() {
    this.app.pathType = metro.setPathType('straight');
  };

  useCurlyPath(): void {
    this.app.pathType = metro.setPathType('curly');
  };

  flipLast(): void {
    let metroLine = metro.getCurrentMetroLine();
    let layerMetroLine = metroLine.layers.metroLine;
    let layerLinePaths = metroLine.layers.linePaths;
    let layerJoints = metroLine.layers.joints;

    let jointData = layerJoints.select('.joint:last-child').datum();
    let linePath = jointData.linePath;
    let linePathData = linePath.datum();
    linePathData.flipped = !linePathData.flipped;
    linePathData.linePath = metro.drawLinePath(
      linePathData.x1, linePathData.y1,
      linePathData.x2, linePathData.y2,
      linePathData.type,
      linePathData.flipped,
      linePath
    );
  };

  setCurrentEditJointType(type: string): void {
    this.app.currentEditJoint.data.type = type;
  };
}
