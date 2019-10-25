import { NgModule } from '@angular/core';
import { SwitchComponent } from './switch.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [SwitchComponent],
  imports: [
    FormsModule,
    CommonModule,
  ],
  exports: [SwitchComponent]
})
export class SwitchModule { }
