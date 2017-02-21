import { Injectable } from '@angular/core';
import './designer';

@Injectable()
export class DesignerService {
  private toolsets: Toolset[] = [];
  private scope: any;
  constructor() { };

  setAppContext(scope: any): void {
    this.scope = scope;
  };

  getAppContext(): any {
    return this.scope;
  };

  extendContext(methods: any): void {
    Object.assign(this.getAppContext(), methods);
  };

  addToolsets(toolsets: Toolset[]): Toolset[] {
    var self = this;
    this.toolsets = this.toolsets.concat(
      toolsets.map((t) => {
        t.action = self.getAppContext()[t.action] || t.action;
        return t;
      })
    );
    return this.toolsets;
  };

  getToolsets(section?: string): Toolset[] {
    return section ? this.toolsets.filter((t) => t.section == section) : this.toolsets;
  };
};
