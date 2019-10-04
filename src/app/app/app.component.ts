import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FilterDataService } from '../service/filter-data.service';
import { FilterService } from '../service/filter.service';
import { FilterStep } from '../model/filter-data.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    private subscription: Subscription;
    
    constructor(private filterDataService: FilterDataService,
                private filterService: FilterService) {}
    
    ngOnInit() {
        
        this.subscription = this.filterDataService
            .loadFilters()
            .subscribe(data => {
                
                this.filterService.initState(data);
            });
    }
    
    ngOnDestroy() {
        
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    
    onApplyFilters(filterSteps: FilterStep[]) {
        
        console.log(filterSteps);
    }
}
