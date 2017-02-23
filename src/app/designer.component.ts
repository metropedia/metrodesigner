import {
  Component,
  ElementRef,
  Input,
  NgZone,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import './designer';
import { DesignerService } from './designer.service';

let Metro = require("../vendor/metrojs/metro").Metro;
let Plugins = require("./plugins/manifest.json");
let preloadPluginTemplates = (template) => {
  Plugins.forEach((plugin) => {
    let dir = plugin.base + '/partials/';
    let toolsetPrimary = require('' + dir + plugin.partials['toolset-primary']);
    let toolsetSecondary = require('' + dir + plugin.partials['toolset-secondary']);
    let panelEast = require('' + dir + plugin.partials['panel-east']);
    let p1 = '<!--primaryToolset-->';
    let p2 = '<!--secondaryToolset-->';
    let p3 = '<!--panelEast-->';
    template = template.replace(p1, p1 + toolsetPrimary);
    template = template.replace(p2, p2 + toolsetSecondary);
    template = template.replace(p3, p3 + panelEast);
  });
  return template;
};

@Component({
  selector: 'metro-designer',
  template: preloadPluginTemplates(require('./designer.component.html')),
  styleUrls: ['./designer.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DesignerComponent {
  @ViewChild('container') container: ElementRef;
  @ViewChild('layoutSouth') layoutSouth: ElementRef;
  public title: string = 'Metro Designer';
  public app: App = {
    metroLines: [],
    currentEditJoint: { data: {} },
    scalePercentage: 100.00,
  };
  private metro: any = null;

  constructor(
    private zone: NgZone,
    private service: DesignerService,
    private changeDetectionRef: ChangeDetectorRef
  ) { };

  ngOnInit(): void {
    console.log('designer.component');

    Plugins.forEach((plugin) => {
      let methods = require('' + plugin.base + '/main');
      Object.assign(this, methods);
    });
  };

  ngAfterViewInit(): void {
    let self = this;
    let startScale = 0.76;
    let app = this.app;
    let width = this.layoutSouth.nativeElement.offsetWidth;
    let height = this.layoutSouth.nativeElement.offsetHeight;
    let def = {
      pointerRadius: 10,
      width: width,
      height: height,
      resolution: 20,
      container: this.container.nativeElement,
      inputMode: 'draw',
      pathType: 'straight',
    };

    this.metro = new Metro(def);

    this.metro.on('zooming', function(transform) {
      self.zone.run(() => {
        app.scalePercentage = parseFloat((transform.k * 100).toFixed(2));
      });
    });

    this.metro.on('jointDrag', function(jointData) {
      self.zone.run(() => {
        app.currentEditJoint = jointData;
      });
    });
  
    this.metro.on('jointMouseDown', function(jointData) {
      self.zone.run(() => {
        app.currentEditJoint = jointData;
      });
    });
  
    this.metro.on('splashButtonClick', function() {
      self.zone.run(() => {
        self.newMetroLine();
      });
    });
  
    this.metro.on('canvasMouseClick', function(shadePos) {
      self.zone.run(() => {
      //console.log(shadePos)
      });
    });

    app.inputMode = this.metro.getInputMode();
    app.pathType = this.metro.getPathType();
    app.canvasWidth = this.metro.width;
    app.canvasHeight = this.metro.height;
    this.center(app.canvasWidth/2*(1-startScale), app.canvasHeight/2*(1-startScale), startScale);
    this.changeDetectionRef.detectChanges();
  };

  zoomIn(): void {
    this.metro.zoomIn(1.5);
  }; 

  zoomOut(): void {
    this.metro.zoomOut(0.75);
  }; 

  center(x, y, k): void {
    this.metro.center(null, null, 1);
  }; 

  newMetroLine(): void {
    const metroLine = this.metro.addMetroLine();
    this.metro.setCurrentMetroLine(metroLine);
    this.app.metroLines = this.metro.getMetroLines();
  };

  editMetroLine(): void {
    this.app.inputMode = this.metro.setInputMode('edit');
    let el = this.metro.getElements();
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
    this.app.inputMode = this.metro.setInputMode('draw');
    const el = this.metro.getElements();
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
    this.app.pathType = this.metro.setPathType('straight');
  };

  useCurlyPath(): void {
    this.app.pathType = this.metro.setPathType('curly');
  };

  flipLast(): void {
    let metroLine = this.metro.getCurrentMetroLine();
    let layerMetroLine = metroLine.layers.metroLine;
    let layerLinePaths = metroLine.layers.linePaths;
    let layerJoints = metroLine.layers.joints;

    let jointData = layerJoints.select('.joint:last-child').datum();
    let linePath = jointData.linePath;
    let linePathData = linePath.datum();
    linePathData.flipped = !linePathData.flipped;
    linePathData.linePath = this.metro.drawLinePath(
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
    let linePathJoint = this.metro.getCurrentEditJoint();
    this.metro.drawLinePath(
      linePathJoint.data.x1, linePathJoint.data.y1,
      linePathJoint.data.x2, linePathJoint.data.y2,
      linePathJoint.data.type,
      linePathJoint.data.flipped,
      linePathJoint.linePath
    );
  };

  splitLinePath = function() {
    const linePathJoint = this.metro.getCurrentEditJoint();
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

    this.metro.drawLinePath(
      left.x1, left.y1,
      left.x2, left.y2,
      left.type, left.flipped,
      null,
      linePathJoint.linePath
    );
    this.metro.drawLinePath(
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
