import { Component, OnInit, Input } from '@angular/core';
import { FilterProperty, FilterConfig, FilterEvent, StringConstraint, NumberConstraint } from '../model/filter-config.model';
import { Filter, Constraint } from '../model/filter-data.model';
import { SelectData } from '../common/model/select-input.model';
import { FilterService } from '../service/filter.service';
import { combineLatest } from 'rxjs';
import { ChangeData } from '../operator-select/operator-select.model';

@Component({
    selector: 'app-property-filter',
    templateUrl: './property-filter.component.html',
    styleUrls: ['./property-filter.component.css']
})
export class PropertyFilterComponent implements OnInit {

    @Input() filterStepIndex: number;
    @Input() filterIndex: number;
    
    filter: Filter;
    
    currentConfig: {event: FilterEvent, property: FilterProperty, constraint: StringConstraint | NumberConstraint};
    
    propertiesDropdown: SelectData;
    constraintsDropdown: {string: SelectData, number: SelectData};
    
    operand: {first: string | number, second: string | number};
    
    constructor(private filterService: FilterService) { }

    ngOnInit() {
        
        combineLatest(this.filterService.filterConfig, this.filterService.filterState)
            .subscribe(([config, state]) => {
                
                const filterStep = state[this.filterStepIndex];
                this.filter = filterStep.filter[this.filterIndex];
                
                const event = config.events.find(event => event.type === filterStep.type);
                const property = event.properties.find(property => property.name === this.filter.property);
                const constraint = this.filter.constraint.type === 'number' 
                    ? property.constraints.numberConstraints.find(constraint => constraint.operator === this.filter.constraint.operator)
                    : property.constraints.stringConstraints.find(constraint => constraint.operator === this.filter.constraint.operator)
                    
                this.currentConfig = { event, property, constraint };
                
                this.propertiesDropdown = this.getPropertiesDropdown(this.currentConfig.event.properties, this.filter);
                this.constraintsDropdown = this.getConstraintsDropdown(this.currentConfig.property, this.filter);
                this.operand = this.getOperands(this.currentConfig.constraint, this.filter);
            });
    }

    onPropertyChange(option: string) {
        
        this.filter.property = option;
        this.filter.constraint = this.getDefaultFilterConstraint(option, this.currentConfig.event.properties);
        
        this.filterService.updateFilterProperty(this.filter, this.filterStepIndex, this.filterIndex);
    }
    
    onOperatorChange(data: ChangeData) {
        
        this.filter.constraint.operator = data.option;
        this.filter.constraint.type = data.type;
        
        this.filterService.updateFilterProperty(this.filter, this.filterStepIndex, this.filterIndex);
    }
    
    onRemove() {
        this.filterService.removeFilterProperty(this.filterStepIndex, this.filterIndex);
    }
    
    isNumericConstraint(): boolean {
        return this.currentConfig.constraint.type === 'number';
    }
    
    showSecondOperand(): boolean {
        return this.currentConfig.constraint.operandsCount === 2;
    }
    
    private getPropertiesDropdown(filterProperties: FilterProperty[], currentFilter: Filter): SelectData {
        
        const propertyOptions = filterProperties.map(property => property.name);
        
        return { 
            options: propertyOptions, 
            selectedOption: currentFilter.property 
        };
    }
    
    private getConstraintsDropdown(property: FilterProperty, currentFilter: Filter): {string: SelectData, number: SelectData} {
        
        const stringOperators = property.constraints.stringConstraints.map(constraint => constraint.operator);
        const numberOperators = property.constraints.numberConstraints.map(constraint => constraint.operator);
        
        const constraintsDropdown = {
            string: { options: stringOperators, selectedOption: null },
            number: { options: numberOperators, selectedOption: null },
        }
        
        if (currentFilter.constraint.type === 'string') {
            constraintsDropdown.string.selectedOption = currentFilter.constraint.operator;
        }
        
        if (currentFilter.constraint.type === 'number') {
            constraintsDropdown.number.selectedOption = currentFilter.constraint.operator;
        }
        
        return constraintsDropdown;
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
    
    private getOperands(constraint: StringConstraint | NumberConstraint, currentFilter: Filter): {first: string | number, second: string | number} {
        
        if (constraint.operandsCount === 2) {
            
            return {
                first: currentFilter.constraint.operands[0],
                second: currentFilter.constraint.operands[1],
            }
        }
        
        return {
            first: currentFilter.constraint.operands[0],
            second: null,
        }
    }
}
