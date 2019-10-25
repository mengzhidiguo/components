import { NgModule } from '@angular/core';
import { SelectComponent } from './select.component';
import { OptionComponent } from './option/option.component';



@NgModule({
  declarations: [SelectComponent, OptionComponent],
  imports: [
  ],
  exports: [SelectComponent, OptionComponent]
})
export class SelectModule { }
