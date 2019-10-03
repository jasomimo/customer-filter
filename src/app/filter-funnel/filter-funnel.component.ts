import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FilterStep } from '../model/filter-data.model';
import { FilterConfig } from '../model/filter-config.model';
import { FilterService } from '../service/filter.service';

@Component({
    selector: 'app-filter-funnel',
    templateUrl: './filter-funnel.component.html',
    styleUrls: ['./filter-funnel.component.css']
})
export class FilterFunnelComponent implements OnInit {

    @Output() applyFilters = new EventEmitter<FilterStep[]>();
    
    config: FilterConfig;
    state: FilterStep[];
    
    constructor(private filterService: FilterService) { }

    ngOnInit() {
        
        this.filterService.filterConfig.subscribe(config => {
            this.config = config;
        });
        
        this.filterService.filterState.subscribe(state => {
            this.state = state;
        });
    }

    onAddFilterStep() {
        this.state.push({ name: null, type: null, filter: [] });
        this.filterService.updateState(this.state);
    }
    
    onApplyFilters() {
        this.applyFilters.emit(this.state);
    }
}
