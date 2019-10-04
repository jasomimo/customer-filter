import { Injectable } from '@angular/core';
import { Constraint } from '../model/filter-data.model';
import { FilterProperty, NumberConstraint, StringConstraint } from '../model/filter-config.model';

@Injectable({
    providedIn: 'root'
})
export class FilterHelperService {

    constructor() { }

    getDefaultFilterConstraint(filterProperty: FilterProperty): Constraint {
        
        const defaultConstraint = filterProperty.constraints.numberConstraints.length > 0 
                ? filterProperty.constraints.numberConstraints[0]
                : filterProperty.constraints.stringConstraints[0];
        
        let defaultOperands = this.getDefaultOperands(defaultConstraint);
        
        return { 
            type: defaultConstraint.type,
            operator: defaultConstraint.operator,
            operands: defaultOperands
        };
    }
    
    getDefaultConstraintOperands(filterProperty: FilterProperty, constraintType: string, operator: string) {
        
        const constraint = constraintType === 'number'
            ? filterProperty.constraints.numberConstraints.find(constraint => constraint.operator === operator)
            : filterProperty.constraints.stringConstraints.find(constraint => constraint.operator === operator);
        
        return this.getDefaultOperands(constraint);
    }
    
    private getDefaultOperands(constraint: NumberConstraint | StringConstraint): string[] | number[] {
        
        let defaultOperands: string[] | number[];
        
        if (constraint.type === 'number') {
            defaultOperands = constraint.operandsCount == 2 ? [0, 0] : [0];
        }
        else {
            defaultOperands = constraint.operandsCount == 2 ? ['', ''] : [''];
        }
        
        return defaultOperands;
    }
}
