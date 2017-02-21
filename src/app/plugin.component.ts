import {
  Directive,
  Input,
  NgZone,
} from '@angular/core';

import './designer';
import { DesignerService } from './designer.service';


@Directive({
  selector: '[plugins]',
})
export class PluginComponent {
  @Input('plugins') public plugins: Plugin[];

  constructor(
    private zone: NgZone,
    private service: DesignerService
  ) { };

  ngOnInit(): void {
    console.log('toolset.component', this.plugins);
    let self = this;

    this.plugins.forEach((plugin) => {
      let methods = require('./plugins/station/main');
      self.service.extendContext(methods);
      self.service.addToolsets(plugin.primaryToolsets);
    });

  };
};
