import { Component, OnInit, Output, EventEmitter, Input, HostBinding, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'mz-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SwitchComponent),
    multi: true
  }],
})
export class SwitchComponent implements OnInit, ControlValueAccessor {

  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() set model(val: boolean) {
    this._model = val;
  }

  @Input() disabled = false;
  @Input() name: string;

  @Input('switch-width') switchWidth = '36px';
  @Input('switch-height') switchHeight = '20px';
  @Input('switch-padding') switchPadding = '2px';
  @Input('switch-button-width') switchButtonWidth = '16px';
  @HostBinding('style') get _style() {
    return this.sanitizer.bypassSecurityTrustStyle(`
		--switch-width: ${this.switchWidth};
		--switch-height: ${this.switchHeight};
		--switch-padding: ${this.switchPadding};
		--switch-button-width: ${this.switchButtonWidth};
		`);
  }


  _model;
  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
  }
  changeHandle(nextValue: boolean): void {
    this.model = nextValue;
    this.modelChange.emit(nextValue);
    this.controlChange(nextValue);
  }
  writeValue(value: any): void {
    this.model = value;
  }

  registerOnChange(fn: Function): void {
    this.controlChange = fn
  }

  registerOnTouched(fn: Function): void {
    this.controlTouch = fn
  }
  private controlChange: Function = () => { };
  private controlTouch: Function = () => { };

}
