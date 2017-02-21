import {
  Component,
  ElementRef,
  Input,
  NgZone,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';

import './designer';
import { DesignerService } from './designer.service';

let Metro = require("../vendor/metrojs/metro").Metro;
let metro = null;

@Component({
  selector: 'metro-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DesignerComponent {
  @ViewChild('container') container: ElementRef;
  public toolsets: Toolset[];
  public title: string = 'Metro Designer';
  public app: App = {
    metroLines: [],
    currentEditJoint: { data: {} },
    scalePercentage: 100.00,
  };

  constructor(
    private zone: NgZone,
    private service: DesignerService
  ) { };

  getPrimaryToolsets(): Toolset[] {
    return this.service.getToolsets();
  };

  ngOnInit(): void {
    console.log('designer.component');

    this.service.setAppContext(this);

    this.service.addToolsets([{
      title: 'Draw',
      inputMode: 'draw',
      action: this.draw,
      section: 'primary',
    }, {
      title: 'Edit',
      inputMode: 'edit',
      action: this.editMetroLine,
      section: 'primary',
    }]);

  };

  ngAfterViewInit(): void {
    let self = this;
    let startScale = 0.76;
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

    metro.on('jointDrag', function(jointData) {
      self.zone.run(() => {
        app.currentEditJoint = jointData;
      });
    });
  
    metro.on('jointMouseDown', function(jointData) {
      self.zone.run(() => {
        app.currentEditJoint = jointData;
      });
    });
  
    metro.on('splashButtonClick', function() {
      self.zone.run(() => {
        self.newMetroLine();
      });
    });
  
    metro.on('canvasMouseClick', function(shadePos) {
      self.zone.run(() => {
      //console.log(shadePos)
      });
    });

    app.inputMode = metro.getInputMode();
    app.pathType = metro.getPathType();
    app.canvasWidth = metro.width;
    app.canvasHeight = metro.height;
    this.center(app.canvasWidth/2*(1-startScale), app.canvasHeight/2*(1-startScale), startScale);
  }

  zoomIn(): void {
    metro.zoomIn(1.5);
  }; 

  zoomOut(): void {
    metro.zoomOut(0.75);
  }; 

  center(x, y, k): void {
    metro.center(null, null, 1);
  }; 

  newMetroLine(): void {
    const metroLine = metro.addMetroLine();
    metro.setCurrentMetroLine(metroLine);
    this.app.metroLines = metro.getMetroLines();
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

  applyLinePathChange = function() {
    let linePathJoint = metro.getCurrentEditJoint();
    metro.drawLinePath(
      linePathJoint.data.x1, linePathJoint.data.y1,
      linePathJoint.data.x2, linePathJoint.data.y2,
      linePathJoint.data.type,
      linePathJoint.data.flipped,
      linePathJoint.linePath
    );
  };

  splitLinePath = function() {
    const linePathJoint = metro.getCurrentEditJoint();
    const d = linePathJoint.data;
    const dx = (d.x2 - d.x1)/2;
    const dy = (d.y2 - d.y1)/2;
    const left = {
      x1: d.x1, y1: d.y1,
      x2: d.x1 + dx, y2: d.y1 + dy,
      type: d.type,
      flipped: d.flipped
    };
    const right = {
      x1: d.x2 - dx, y1: d.y2 - dy,
      x2: d.x2, y2: d.y2,
      type: d.type,
      flipped: d.flipped
    };

    metro.drawLinePath(
      left.x1, left.y1,
      left.x2, left.y2,
      left.type, left.flipped,
      null,
      linePathJoint.linePath
    );
    metro.drawLinePath(
      right.x1, right.y1,
      right.x2, right.y2,
      right.type, right.flipped,
      null,
      linePathJoint.linePath
    );

    linePathJoint.joint.remove();
    linePathJoint.linePath.remove();
  };
}
