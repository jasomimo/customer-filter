import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FilterStep } from '../model/filter-data.model';
import { FilterConfig } from '../model/filter-config.model';

@Component({
    selector: 'app-filter-funnel',
    templateUrl: './filter-funnel.component.html',
    styleUrls: ['./filter-funnel.component.css']
})
export class FilterFunnelComponent implements OnInit {

    @Input() config: FilterConfig;
    @Input() state: FilterStep[];
    
    @Output() applyFilters = new EventEmitter<FilterStep[]>();

    // innerState: FilterStep[] = [];
    
    constructor() { }

    ngOnInit() {
        
        this.validateConfig(this.config);
        
        if (!this.state || this.state.length === 0) {
            
            this.state = this.initEmptyState(this.config);
        }
    }

    onApplyFilters() {
        
        // TODO: get real filter state
        this.applyFilters.emit(this.state);
    }
    
    private validateConfig(config: FilterConfig) {
        
        if (config) {
            throw Error('Filter config is not defined.');
        }
        
        if (!config.events || config.events.length === 0) {
            throw Error('Events in Filter config are not defined.');
        }
    }
    
    private initEmptyState(config: FilterConfig): FilterStep[] {
        
        const firstEvent = config.events[0];
        
        return [
            { name: firstEvent.type, type: firstEvent.type, filter: [] }
        ];
    }
}
