import { Component, OnInit, Input } from '@angular/core';
import { FilterConfig, FilterProperty } from '../model/filter-config.model';
import { FilterStep, Filter } from '../model/filter-data.model';
import { SelectData } from '../common/model/select-input.model';
import { FilterService } from '../service/filter.service';
import { combineLatest } from 'rxjs';

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
    
    constructor(private filterService: FilterService) { }

    ngOnInit() {
        
        combineLatest(this.filterService.filterConfig, this.filterService.filterState)
            .subscribe(([config, state]) => {
                
                this.config = config;
                this.filterStep = state[this.filterStepIndex];
                
                this.eventDropdown = this.getEventDropdownData(this.config, this.filterStep);
            });
    }
    
    onEventSelect(option: string) {
        
        console.log(option);
        
        this.filterStep.type = option;
        this.filterStep.filter = [this.getDefaultFilter(option)];
        
        this.filterService.updateFilterStep(this.filterStep, this.filterStepIndex);
    }
    
    onRefineMore() {
        
        this.filterStep.filter.push(this.getDefaultFilter(this.filterStep.type));
        this.filterService.updateFilterStep(this.filterStep, this.filterStepIndex);
    }
    
    private getEventDropdownData(confgi: FilterConfig, filterStep: FilterStep): SelectData {
        
        const options = confgi.events.map(event => event.type);
        const selectedOption = filterStep.type;
        
        return { options, selectedOption };
    }
    
    private getDefaultFilter(eventType: string): Filter {
        
        const event = this.config.events.find(e => e.type === eventType);
        const firstProperty = event.properties[0];
        
        const defaultConstraint = firstProperty.constraints.numberConstraints.length > 0 
                ? firstProperty.constraints.numberConstraints[0]
                : firstProperty.constraints.stringConstraints[0];
        
        return {
            property: firstProperty.name,
            constraint: { 
                type: defaultConstraint.type,
                operator: defaultConstraint.operator,
                operands: []
            }
        };
    }
}
