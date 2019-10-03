import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-select-input',
	templateUrl: './select-input.component.html',
	styleUrls: ['./select-input.component.css']
})
export class SelectInputComponent implements OnInit {

	@Input() options: string[];
	@Input() selectedOption: string;
	
	@Output() change = new EventEmitter<string>();
	
	constructor() { }

	ngOnInit() {
		
		if (!this.options || this.options.length === 0) {
			throw new Error('Options for select input are not defined');
		}
		
		if (!this.selectedOption) {
			this.selectedOption = this.options[0];
		}
	}
	
	onChange(option:string) {
		
		this.selectedOption = option;
		this.change.emit(option);
	}

}
