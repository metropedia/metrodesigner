import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { DesignerComponent } from './designer.component';
import { PluginComponent } from './plugin.component';
import { DesignerService } from './designer.service';

@NgModule({
  declarations: [
    AppComponent,
    DesignerComponent,
    PluginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [DesignerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
