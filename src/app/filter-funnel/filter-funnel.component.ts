import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FilterStep } from '../model/filter-data.model';
import { FilterService } from '../service/filter.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-filter-funnel',
    templateUrl: './filter-funnel.component.html',
    styleUrls: ['./filter-funnel.component.css']
})
export class FilterFunnelComponent implements OnInit, OnDestroy {

    @Output() applyFilters = new EventEmitter<FilterStep[]>();
    
    state: FilterStep[];
    stateSubscription: Subscription;
    
    constructor(private filterService: FilterService) { }

    ngOnInit() {
        
        this.stateSubscription = this.filterService.filterState.subscribe(state => {
            this.state = state;
        });
    }
    
    ngOnDestroy() {
        
        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
    }
    
    onAddFilterStep() {
        this.state.push({ name: null, type: null, filter: [] });
        this.filterService.updateState(this.state);
    }
    
    onApplyFilters() {
        this.applyFilters.emit(this.state);
    }
}
