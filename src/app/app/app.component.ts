import { Component, OnInit } from '@angular/core';
import { FilterDataService } from '../service/filter-data.service';
import { FilterService } from '../service/filter.service';
import { FilterStep } from '../model/filter-data.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(private filterDataService: FilterDataService,
                private filterService: FilterService) {}
    
    ngOnInit() {
        
        // this.filterDataService
        //     .loadFilters()
        //     .subscribe(data => {
                
        //         this.filterService.updateState(data);
        //     });
    }
    
    onApplyFilters(filterSteps: FilterStep[]) {
        
        console.log(filterSteps);
    }
}
