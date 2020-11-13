import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "mz-option",
  templateUrl: "./option.component.html",
  styleUrls: ["./option.component.scss"],
  host: {
    "(click)": "_check()",
  },
})
export class OptionComponent implements OnInit {
  @Input() value;
  @Input() label;
  @Input() set checked(checked: string) {}

  @Output() checkedEmit = new EventEmitter();
  constructor() {}

  ngOnInit() {}
  _check() {
    this.checkedEmit.emit(this.value);
  }
}
