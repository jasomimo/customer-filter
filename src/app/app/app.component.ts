import { Component, OnInit } from '@angular/core';
import { FilterDataService } from '../service/filter-data.service';
import { FilterConfig } from '../model/filter-config.model';
import { FilterConfigService } from '../service/filter-config.service';
import { FilterStep } from '../model/filter-data.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    
    filterConfig: FilterConfig;
    filterState: FilterStep[];
    
    constructor(private filterDataService: FilterDataService,
                private filterConfigService: FilterConfigService) {}
    
    ngOnInit() {
        
        this.filterDataService
            .loadFilters()
            .subscribe(data => {
                
                console.log(data);
                this.filterState = data;
            });
            
        this.filterConfigService
            .loadFilterConfig()
            .subscribe(config => {
                
                console.log(config);
                this.filterConfig = config;
            });
    }
    
    onApplyFilters(filterSteps: FilterStep[]) {
        
        console.log(this.filterState);
    }
}
