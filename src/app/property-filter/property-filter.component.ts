import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { FilterProperty, FilterEvent, StringConstraint, NumberConstraint } from '../model/filter-config.model';
import { Filter } from '../model/filter-data.model';
import { SelectData } from '../common/select-input/select-input.model';
import { FilterService } from '../service/filter.service';
import { ChangeData } from '../operator-select/operator-select.model';
import { FilterHelperService } from '../service/filter-helper.service';

@Component({
    selector: 'app-property-filter',
    templateUrl: './property-filter.component.html',
    styleUrls: ['./property-filter.component.css']
})
export class PropertyFilterComponent implements OnInit, OnDestroy {

    @Input() filterStepIndex: number;
    @Input() filterIndex: number;
    
    filter: Filter;
    
    currentConfig: {event: FilterEvent, property: FilterProperty, constraint: StringConstraint | NumberConstraint};
    
    propertiesDropdown: SelectData;
    constraintsDropdown: {string: SelectData, number: SelectData};
    
    operands: string[] | number[];
    
    removeIcon = faTimes;
    
    private subscription: Subscription;
    
    constructor(private filterService: FilterService, private helpreService: FilterHelperService) { }

    ngOnInit(): void {
        
        this.subscription = combineLatest(this.filterService.filterConfig, this.filterService.filterState)
            .subscribe(([config, state]) => {
                
                const filterStep = state[this.filterStepIndex];
                
                if (!filterStep) {
                    // filter step was removed
                    return;
                }
                
                this.filter = filterStep.filter[this.filterIndex];
                
                if (!this.filter) {
                    // filter was removed
                    return;
                }
                
                // update current config
                const event = config.events.find(event => event.type === filterStep.type);
                const property = event.properties.find(property => property.name === this.filter.property);
                const constraint = this.filter.constraint.type === 'number' 
                    ? property.constraints.numberConstraints.find(constraint => constraint.operator === this.filter.constraint.operator)
                    : property.constraints.stringConstraints.find(constraint => constraint.operator === this.filter.constraint.operator)
                    
                this.currentConfig = { event, property, constraint };
                
                // update page data
                this.propertiesDropdown = this.getPropertiesDropdown(this.currentConfig.event.properties, this.filter);
                this.constraintsDropdown = this.getConstraintsDropdown(this.currentConfig.property, this.filter);
                this.operands = this.filter.constraint.operands;
            });
    }
    
    ngOnDestroy(): void {
        
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onPropertyChange(option: string): void {
        
        this.filter.property = option;
        
        const filterProperty = this.currentConfig.event.properties.find(prop => prop.name === option);
        this.filter.constraint = this.helpreService.getDefaultFilterConstraint(filterProperty);
        
        this.filterService.updateFilterProperty(this.filter, this.filterStepIndex, this.filterIndex);
    }
    
    onOperatorChange(data: ChangeData): void {
        
        this.filter.constraint.operator = data.option;
        this.filter.constraint.type = data.type;
        
        this.filter.constraint.operands = this.helpreService.getDefaultConstraintOperands(this.currentConfig.property, data.type, data.option);
        
        this.filterService.updateFilterProperty(this.filter, this.filterStepIndex, this.filterIndex);
    }
    
    onOperandChanged(index: number): void {
        
        let operandChanged = false;
        
        if (this.filter.constraint.type === 'number') {
            
            operandChanged = this.filter.constraint.operands[index] !== +this.operands[index];
            
            if (operandChanged) {
                this.filter.constraint.operands[index] = +this.operands[index];
            }
        }
        else {
            
            operandChanged = this.filter.constraint.operands[index] !== this.operands[index];
            
            if (operandChanged) {
                this.filter.constraint.operands[index] = this.operands[index];
            }
        }
        
        if (operandChanged) {
            this.filterService.updateFilterProperty(this.filter, this.filterStepIndex, this.filterIndex);
        }
    }
    
    onRemove(): void {
        this.filterService.removeFilterProperty(this.filterStepIndex, this.filterIndex);
    }
    
    // UI helpers
    showSecondOperand(): boolean {
        return this.currentConfig.constraint.operandsCount === 2;
    }
    
    showRemoveIcon(): boolean {
        return this.filterIndex !== 0;
    }
    
    // Helpers
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
}
