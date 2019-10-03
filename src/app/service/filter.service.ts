import { Injectable } from '@angular/core';
import { FilterConfig, NumberConstraint, StringConstraint } from '../model/filter-config.model';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash-es';
import { FilterStep, Filter } from '../model/filter-data.model';

@Injectable({
    providedIn: 'root'
})
export class FilterService {

    constructor() { }

    // Filter state
    private _filterState: FilterStep[] = [{ name: null, type: null, filter: [] }];
    
    filterState = new BehaviorSubject<FilterStep[]>(this._filterState);
    
    updateState(filterState: FilterStep[]) {
        
        if (!filterState || filterState.length === 0) {
            return;
        }
        
        this._filterState = filterState;
        this.filterState.next(cloneDeep(this._filterState));
    }
    
    updateFilterStep(filterStep: FilterStep, index: number) {
        
        if (!filterStep) {
            throw new Error('filterStep is not defined');
        }
        
        this._filterState[index] = filterStep;
        this.filterState.next(cloneDeep(this._filterState));
    }
    
    updateFilterProperty(filter: Filter, filterStepIndex: number, filterIndex: number) {
        
        const filterStep = this._filterState[filterStepIndex];
        filterStep.filter[filterIndex] = filter;
        
        this.filterState.next(cloneDeep(this._filterState));
    }
    
    removeFilterProperty(filterStepIndex: number, filterIndex: number) {
        
        const filterStep = this._filterState[filterStepIndex];
        filterStep.filter.splice(filterIndex, 1);
        
        this.filterState.next(cloneDeep(this._filterState));
    }
    
    // Filter configuration
    filterConfig = new BehaviorSubject<FilterConfig>(this.getFilerConfig());
    
    private getFilerConfig(): FilterConfig {
        return {
            events: [
                { 
                    type: 'banner', 
                    properties: [
                        { 
                            name: 'variant_id', 
                            constraints: { numberConstraints: this.getNumberConstraints(), stringConstraints: this.getStringConstraints() } 
                        },
                        { 
                            name: 'display_count', 
                            constraints: { numberConstraints: this.getNumberConstraints(), stringConstraints: this.getStringConstraints() } 
                        }
                    ]
                },
                { 
                    type: 'first_session', 
                    properties: [
                        { 
                            name: 'browser', 
                            constraints: { numberConstraints: this.getNumberConstraints(), stringConstraints: this.getStringConstraints() } 
                        },
                        { 
                            name: 'city', 
                            constraints: { numberConstraints: this.getNumberConstraints(), stringConstraints: this.getStringConstraints() } 
                        },
                        { 
                            name: 'operation system', 
                            constraints: { numberConstraints: this.getNumberConstraints(), stringConstraints: this.getStringConstraints() } 
                        }
                    ]
                },
                { 
                    type: 'python_script_1', 
                    properties: [
                        { 
                            name: 'price', 
                            constraints: { numberConstraints: this.getNumberConstraints(), stringConstraints: this.getStringConstraints() } 
                        },
                        { 
                            name: 'number of items', 
                            constraints: { numberConstraints: this.getNumberConstraints(), stringConstraints: this.getStringConstraints() } 
                        }, 
                        { 
                            name: 'index', 
                            constraints: { numberConstraints: this.getNumberConstraints(), stringConstraints: this.getStringConstraints() } 
                        }, 
                    ]
                },
                { 
                    type: 'page_visit', 
                    properties: [
                        { 
                            name: 'campaign id', 
                            constraints: { numberConstraints: this.getNumberConstraints(), stringConstraints: this.getStringConstraints() } 
                        },
                        { 
                            name: 'emojis', 
                            constraints: { numberConstraints: this.getNumberConstraints(), stringConstraints: this.getStringConstraints() } 
                        }, 
                        { 
                            name: 'text on page', 
                            constraints: { numberConstraints: null, stringConstraints: this.getStringConstraints() } 
                        }, 
                    ]
                }
            ]
        };
    }
    
    private getNumberConstraints(): NumberConstraint[] {
        return [
            this.getNumberConstraint('equal to', 1),
            this.getNumberConstraint('in between', 2),
            this.getNumberConstraint('less than', 1),
            this.getNumberConstraint('greater than', 1)
        ];
    }
    
    private getNumberConstraint(operator: string, operandsCount: number): NumberConstraint {
        return { type: 'number', operator, operandsCount };
    }
    
    private getStringConstraints(): StringConstraint[] {
        return [
            this.getStringConstraint('equals', 1),
            this.getStringConstraint('does not equal', 1),
            this.getStringConstraint('contains', 1),
            this.getStringConstraint('does not contains', 1)
        ];
    }
    
    private getStringConstraint(operator: string, operandsCount: number): StringConstraint {
        return { type: 'string', operator, operandsCount };
    }
}
