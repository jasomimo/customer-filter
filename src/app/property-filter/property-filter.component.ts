import { Component, OnInit, Input } from '@angular/core';
import { FilterProperty, FilterConfig } from '../model/filter-config.model';
import { Filter, Constraint } from '../model/filter-data.model';
import { SelectData } from '../common/model/select-input.model';
import { FilterService } from '../service/filter.service';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'app-property-filter',
    templateUrl: './property-filter.component.html',
    styleUrls: ['./property-filter.component.css']
})
export class PropertyFilterComponent implements OnInit {

    @Input() filterStepIndex: number;
    @Input() filterIndex: number;
    
    filter: Filter;
    filterProperties: FilterProperty[];
    propertiesDropdown: SelectData;
    
    constructor(private filterService: FilterService) { }

    ngOnInit() {
        
        combineLatest(this.filterService.filterConfig, this.filterService.filterState)
            .subscribe(([config, state]) => {
                
                const filterStep = state[this.filterStepIndex];
                this.filter = filterStep.filter[this.filterIndex];
                
                this.filterProperties = this.getFilterProperties(filterStep.type, config);
                
                const options = this.filterProperties.map(property => property.name);
                
                this.propertiesDropdown = { options, selectedOption: this.filter.property };
            });
    }

    onPropertySelect(option: string) {
        
        this.filter.property = option;
        this.filter.constraint = this.getDefaultFilterConstraint(option, this.filterProperties);
        
        this.filterService.updateFilterProperty(this.filter, this.filterStepIndex, this.filterIndex);
    }
    
    onRemove() {
        this.filterService.removeFilterProperty(this.filterStepIndex, this.filterIndex);
    }
    
    private getFilterProperties(selectedEventType: string, config: FilterConfig): FilterProperty[] {
        
        if (!selectedEventType) {
            return null;
        }
        
        const selectedEvent = config.events.find(event => event.type === selectedEventType);
        
        return selectedEvent.properties;
    }
    
    private getDefaultFilterConstraint(propertyName: string, filterProperties: FilterProperty[]): Constraint {
        
        const filterProperty = filterProperties.find(property => property.name === propertyName);
        
        const defaultConstraint = filterProperty.constraints.numberConstraints.length > 0 
                ? filterProperty.constraints.numberConstraints[0]
                : filterProperty.constraints.stringConstraints[0];
        
        return {
            type: defaultConstraint.type,
            operator: defaultConstraint.operator,
            operands: []
        }
    }
}
