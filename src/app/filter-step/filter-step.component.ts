import { Component, OnInit, Input } from '@angular/core';
import { FilterConfig } from '../model/filter-config.model';
import { FilterStep } from '../model/filter-data.model';

@Component({
    selector: 'app-filter-step',
    templateUrl: './filter-step.component.html',
    styleUrls: ['./filter-step.component.css']
})
export class FilterStepComponent implements OnInit {

    @Input() config: FilterConfig;
    @Input() filterStep: FilterStep;
    @Input() filterStepIndex: number;

    constructor() { }

    ngOnInit() {
        console.log(this.filterStep);
        console.log(this.filterStepIndex);
    }

}
