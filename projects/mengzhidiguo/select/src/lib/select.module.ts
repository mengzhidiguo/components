import { NgModule } from "@angular/core";
import { SelectComponent } from "./select/select.component";
import { OptionComponent } from "./option/option.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [SelectComponent, OptionComponent],
  imports: [FormsModule, CommonModule],
  exports: [SelectComponent, OptionComponent],
})
export class SelectModule {}
