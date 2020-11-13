import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, forwardRef, Input, OnInit, Output, QueryList } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { concat, merge, of } from 'rxjs';
import { OptionComponent } from '../option/option.component';

@Component({
  selector: "mz-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => SelectComponent),
		multi: true
	}]
})
export class SelectComponent implements AfterContentInit, ControlValueAccessor {
	_model;
	@Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
	@Input() set model(val: boolean) {
		this._model = val;
	}
	isOpen = false;
	label: string;
	private _isTop = false;
	@ContentChildren(OptionComponent, {
	}) options: QueryList<OptionComponent>;
	get triggerClass() {
		return {
			'option-container--top': this._isTop,
			'option-container--bottom': !this._isTop,
			'option-container--open': this.isOpen,
			'option-container--close': !this.isOpen
		}
	}
	constructor(
		private cdr: ChangeDetectorRef,
	) { }

	ngAfterContentInit(): void {
		concat(of(this.options), this.options.changes)
			.subscribe(this.optionsChange.bind(this));
	}

	optionsChange(options: QueryList<OptionComponent>) {
		const optionsObs = options.toArray().map(option => option.checkedEmit.asObservable());
		merge(...optionsObs).subscribe(value => this.valueChange(options.toArray(), value));
	}
	valueChange(options: OptionComponent[], value: any) {
		this.isOpen = false;
		options.forEach(option => {
			if (value === option.value) {
				option.checked = 'checked';
				this.label = option.label;
				this.model = value;
				this.modelChange.emit(value);
				this.controlChange(value);
				this.cdr.detectChanges();
			} else {
				option.checked = null;
			}
		});
	}
	writeValue(value): void {
		if (!!this.options) {
			this.valueChange(this.options.toArray(), value);
		}
	}
	registerOnChange(fn: Function): void {
		this.controlChange = fn;
	}

	registerOnTouched(fn: Function): void {
		this.controlTouch = fn;
	}
	setDisabledState?(isDisabled: boolean): void {
	}
	private controlChange: Function = () => { };
	private controlTouch: Function = () => { };
}

