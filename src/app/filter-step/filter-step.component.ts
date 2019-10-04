import { Component, OnInit, Input } from '@angular/core';
import { faPencilAlt, faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import { combineLatest } from 'rxjs';

import { FilterConfig, FilterEvent } from '../model/filter-config.model';
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
    
    currentEvent: FilterEvent;
    filterStep: FilterStep;

    eventDropdown: SelectData;
    
    editingName = false;
    
    pencilIcon = faPencilAlt;
    trashIcon = faTrashAlt;
    cloneIcon = faClone;
    
    constructor(private filterService: FilterService) { }

    ngOnInit() {
        
        combineLatest(this.filterService.filterConfig, this.filterService.filterState)
            .subscribe(([config, state]) => {
                
                this.filterStep = state[this.filterStepIndex];
                
                if (!this.filterStep) {
                    return;
                }
                
                this.currentEvent = config.events.find(event => event.type === this.filterStep.type);
                this.eventDropdown = this.getEventDropdownData(config, this.filterStep);
            });
    }
    
    onEventChange(option: string): void {
        
        console.log(option);
        
        this.filterStep.name = this.filterStep.name || option;
        this.filterStep.type = option;
        this.filterStep.filter = [];
        // this.filterStep.filter = [this.getDefaultFilter(option)];
        
        this.filterService.updateFilterStep(this.filterStep, this.filterStepIndex);
    }
    
    // Edit step name
    onEditName(): void {
        this.editingName = true;
    }
    
    onSaveName(): void {
        this.editingName = false;
        this.onEventChange(this.filterStep.type);
    }
    
    cloneFilterStep(): void {
        this.filterService.addFilterStep(this.filterStep);
    }
    
    // Remove this filter step
    removeFilterStep(): void {
        this.filterService.removeFilterStep(this.filterStepIndex);
    }
    
    // Add new filter property
    onRefineMore(): void {
        
        this.filterStep.filter.push(this.getDefaultFilter(this.currentEvent));
        // this.filterStep.filter.push(this.getDefaultFilter(this.currentEvent.type));
        this.filterService.updateFilterStep(this.filterStep, this.filterStepIndex);
    }
    
    
    
    // UI helpers
    filterEventChosen(): boolean {
        return !!this.filterStep.type;
    }
    
    anyFilters(): boolean {
        return this.filterStep.type && this.filterStep.filter && this.filterStep.filter.length > 0;
    }
    
    private getEventDropdownData(confgi: FilterConfig, filterStep: FilterStep): SelectData {
        
        const options = confgi.events.map(event => event.type);
        const selectedOption = filterStep.type;
        
        return { options, selectedOption };
    }
    
    private getDefaultFilter(currentEvent: FilterEvent): Filter {
        
        const defaultProperty = currentEvent.properties[0];
        
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
