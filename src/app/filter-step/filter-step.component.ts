import { Component, OnInit, Input } from '@angular/core';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { combineLatest } from 'rxjs';

import { FilterConfig } from '../model/filter-config.model';
import { FilterStep, Filter } from '../model/filter-data.model';
import { SelectData } from '../common/model/select-input.model';
import { FilterService } from '../service/filter.service';


@Component({
    selector: 'app-filter-step',
    templateUrl: './filter-step.component.html',
    styleUrls: ['./filter-step.component.css']
})
export class FilterStepComponent implements OnInit {

    @Input() filterStepIndex: number;
    
    config: FilterConfig;
    filterStep: FilterStep;

    eventDropdown: SelectData;
    
    pencilIcon = faPencilAlt;
    editingName = false;
    
    constructor(private filterService: FilterService) { }

    ngOnInit() {
        
        combineLatest(this.filterService.filterConfig, this.filterService.filterState)
            .subscribe(([config, state]) => {
                
                this.config = config;
                this.filterStep = state[this.filterStepIndex];
                
                this.eventDropdown = this.getEventDropdownData(this.config, this.filterStep);
            });
    }
    
    onEventChange(option: string) {
        
        console.log(option);
        
        this.filterStep.name = this.filterStep.name || option;
        this.filterStep.type = option;
        this.filterStep.filter = [this.getDefaultFilter(option)];
        
        this.filterService.updateFilterStep(this.filterStep, this.filterStepIndex);
    }
    
    onRefineMore() {
        
        this.filterStep.filter.push(this.getDefaultFilter(this.filterStep.type));
        this.filterService.updateFilterStep(this.filterStep, this.filterStepIndex);
    }
    
    onEditName() {
        
        this.editingName = true;
    }
    
    onSaveName() {
        this.editingName = false;
        this.onEventChange(this.filterStep.type);
    }
    
    private getEventDropdownData(confgi: FilterConfig, filterStep: FilterStep): SelectData {
        
        const options = confgi.events.map(event => event.type);
        const selectedOption = filterStep.type;
        
        return { options, selectedOption };
    }
    
    private getDefaultFilter(eventType: string): Filter {
        
        const event = this.config.events.find(e => e.type === eventType);
        const defaultProperty = event.properties[0];
        
        const defaultConstraint = defaultProperty.constraints.numberConstraints.length > 0 
                ? defaultProperty.constraints.numberConstraints[0]
                : defaultProperty.constraints.stringConstraints[0];
        
        let defaultOperands: string[] | number[];
        
        if (defaultConstraint.type === 'number') {
            defaultOperands = defaultConstraint.operandsCount == 2 ? [0, 0] : [0];
        }
        else {
            defaultOperands = defaultConstraint.operandsCount == 2 ? ['', ''] : [''];
        }
                
        return {
            property: defaultProperty.name,
            constraint: { 
                type: defaultConstraint.type,
                operator: defaultConstraint.operator,
                operands: defaultOperands
            }
        };
    }
}
