import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectData } from '../common/model/select-input.model';

@Component({
    selector: 'app-operator-select',
    templateUrl: './operator-select.component.html',
    styleUrls: ['./operator-select.component.css']
})
export class OperatorSelectComponent implements OnInit {

    @Input() stringOperators: SelectData;
    @Input() numberOperators: SelectData;

    // TODO: create interface
    @Output() change = new EventEmitter<{option: string, type: string}>();
    
    showMenu = false;
    showNumberSelect = true;

    constructor() { }

    ngOnInit() {
        
    }
    
    onFocus() {
        this.showMenu = true;
    }
    
    onFocusOut() {
        this.showMenu = false;
    }

    onShowNumber(showNumber: boolean) {
        this.showNumberSelect = showNumber;
    }

    onNumberOperatorChange(option: string) {
        this.change.emit({option, type: 'number'});
    }
    
    onStringOperatorChange(option: string) {
        this.change.emit({option, type: 'string'});
    }
}
