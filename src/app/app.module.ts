import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { DesignerComponent } from './designer.component';
import { DesignerService } from './designer.service';

@NgModule({
  declarations: [
    AppComponent,
    DesignerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    NgbModule.forRoot()
  ],
  providers: [DesignerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
