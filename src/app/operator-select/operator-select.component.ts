import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectData } from '../common/model/select-input.model';
import { ChangeData } from './operator-select.model';

import { faAlignCenter } from '@fortawesome/free-solid-svg-icons'

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

    ngOnInit() {
        this.showNumberSelect = this.stringOperators.selectedOption === null;
    }
    
    onShowNumber(showNumber: boolean) {
        this.showNumberSelect = showNumber;
    }

    onNumberOperatorChange(option: string) {
        
        this.stringOperators.selectedOption = null;
        this.numberOperators.selectedOption = option;
        
        this.change.emit({option, type: 'number'});
    }
    
    onStringOperatorChange(option: string) {
        
        this.stringOperators.selectedOption = option;
        this.numberOperators.selectedOption = null;
        
        this.change.emit({option, type: 'string'});
    }
}
