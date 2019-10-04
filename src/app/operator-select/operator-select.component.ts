import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faAlignCenter } from '@fortawesome/free-solid-svg-icons'

import { SelectData } from '../common/select-input/select-input.model';
import { ChangeData } from './operator-select.model';

@Component({
    selector: 'app-operator-select',
    templateUrl: './operator-select.component.html',
    styleUrls: ['./operator-select.component.css']
})
export class OperatorSelectComponent implements OnInit {

    @Input() stringOperators: SelectData;
    @Input() numberOperators: SelectData;
    
    @Output() change = new EventEmitter<ChangeData>();
    
    showNumberSelect = true;
    textIcon = faAlignCenter;

    constructor() { }

    ngOnInit(): void {
        this.showNumberSelect = this.stringOperators.selectedOption === null;
    }
    
    onShowNumber(showNumber: boolean): void {
        this.showNumberSelect = showNumber;
        
        // autoselect first option from displayed options
        if (showNumber) {
            this.onNumberOperatorChange(this.numberOperators.options[0]);
        }
        else {
            this.onStringOperatorChange(this.stringOperators.options[0]);
        }
    }

    onNumberOperatorChange(option: string): void {
        
        this.stringOperators.selectedOption = null;
        this.numberOperators.selectedOption = option;
        
        this.change.emit({option, type: 'number'});
    }
    
    onStringOperatorChange(option: string): void {
        
        this.stringOperators.selectedOption = option;
        this.numberOperators.selectedOption = null;
        
        this.change.emit({option, type: 'string'});
    }
}
