import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
