import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { SwitchModule } from '@mengzhidiguo/switch';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SwitchModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
