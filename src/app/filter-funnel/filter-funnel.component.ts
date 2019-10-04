import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FilterStep } from '../model/filter-data.model';
import { FilterService } from '../service/filter.service';

@Component({
    selector: 'app-filter-funnel',
    templateUrl: './filter-funnel.component.html',
    styleUrls: ['./filter-funnel.component.css']
})
export class FilterFunnelComponent implements OnInit, OnDestroy {

    @Output() applyFilters = new EventEmitter<FilterStep[]>();
    
    state: FilterStep[];
    subscription: Subscription;
    
    constructor(private filterService: FilterService) { }

    ngOnInit(): void {
        
        this.subscription = this.filterService.filterState.subscribe(state => {
            this.state = state;
        });
    }
    
    ngOnDestroy(): void {
        
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    
    onAddFilterStep(): void {
        const emptyStep = { name: null, type: null, filter: [] };
        this.filterService.addFilterStep(emptyStep);
    }
    
    onDiscardFilters(): void {
        this.filterService.initState([]);
    }
    
    onApplyFilters(): void {
        this.applyFilters.emit(this.state);
    }
}
