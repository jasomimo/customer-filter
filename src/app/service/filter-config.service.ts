import { Injectable } from '@angular/core';
import { FilterConfig, NumberConstraint, StringConstraint } from '../model/filter-config.model';
import { of, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FilterConfigService {

    constructor() { }

    loadFilterConfig(): Observable<FilterConfig> {
        
        return of({
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
        });
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
