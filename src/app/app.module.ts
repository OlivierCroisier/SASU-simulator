import {BrowserModule} from "@angular/platform-browser";
import {LOCALE_ID, NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {ReactiveFormsModule} from "@angular/forms";
import { GraphSankeyComponent } from './graph-sankey/graph-sankey.component';

@NgModule({
  declarations: [
    AppComponent,
    GraphSankeyComponent
  ],
  imports: [
      BrowserModule,
      ReactiveFormsModule
  ],
  providers: [
      {provide: LOCALE_ID, useValue: "fr-FR"}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
