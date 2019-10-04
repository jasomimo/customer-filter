import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { faPencilAlt, faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, Subscription } from 'rxjs';

import { FilterConfig, FilterEvent } from '../model/filter-config.model';
import { FilterStep, Filter } from '../model/filter-data.model';
import { SelectData } from '../common/select-input/select-input.model';
import { FilterService } from '../service/filter.service';
import { FilterHelperService } from '../service/filter-helper.service';


@Component({
    selector: 'app-filter-step',
    templateUrl: './filter-step.component.html',
    styleUrls: ['./filter-step.component.css']
})
export class FilterStepComponent implements OnInit, OnDestroy {

    @Input() filterStepIndex: number;
    
    currentEvent: FilterEvent;
    filterStep: FilterStep;

    eventDropdown: SelectData;
    
    editingName = false;
    
    pencilIcon = faPencilAlt;
    trashIcon = faTrashAlt;
    cloneIcon = faClone;
    
    private subscription: Subscription;
    
    constructor(private filterService: FilterService, private helpreService: FilterHelperService) { }

    ngOnInit(): void {
        
        this.subscription = combineLatest(this.filterService.filterConfig, this.filterService.filterState)
            .subscribe(([config, state]) => {
                
                this.filterStep = state[this.filterStepIndex];
                
                if (!this.filterStep) {
                    // filter step was removed
                    return;
                }
                
                this.currentEvent = config.events.find(event => event.type === this.filterStep.type);
                this.eventDropdown = this.getEventDropdownData(config, this.filterStep);
            });
    }
    
    ngOnDestroy(): void {
        
        if(this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    
    onEventChange(option: string): void {
        
        this.filterStep.name = this.filterStep.name || option;
        this.filterStep.type = option;
        this.filterStep.filter = [];
        
        this.filterService.updateFilterStep(this.filterStep, this.filterStepIndex);
    }
    
    // Edit step name
    onEditName(): void {
        this.editingName = true;
    }
    
    onSaveName(): void {
        this.editingName = false;
        this.filterService.updateFilterStep(this.filterStep, this.filterStepIndex);
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
        this.filterService.updateFilterStep(this.filterStep, this.filterStepIndex);
    }
    
    // UI helpers
    filterEventChosen(): boolean {
        return !!this.filterStep.type;
    }
    
    anyFilters(): boolean {
        return this.filterStep.type && this.filterStep.filter && this.filterStep.filter.length > 0;
    }
    
    // Helpers
    private getEventDropdownData(confgi: FilterConfig, filterStep: FilterStep): SelectData {
        
        const options = confgi.events.map(event => event.type);
        const selectedOption = filterStep.type;
        
        return { options, selectedOption };
    }
    
    private getDefaultFilter(currentEvent: FilterEvent): Filter {
        
        const defaultProperty = currentEvent.properties[0];
        const defaultConstraint = this.helpreService.getDefaultFilterConstraint(defaultProperty);
                
        return {
            property: defaultProperty.name,
            constraint: defaultConstraint
        };
    }
}
