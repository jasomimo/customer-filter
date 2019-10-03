import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { FilterFunnelComponent } from './filter-funnel/filter-funnel.component';
import { FilterStepComponent } from './filter-step/filter-step.component';
import { SelectInputComponent } from './common/select-input/select-input.component';
import { PropertyFilterComponent } from './property-filter/property-filter.component';
import { OperatorSelectComponent } from './operator-select/operator-select.component';

@NgModule({
    declarations: [
        AppComponent,
        FilterFunnelComponent,
        FilterStepComponent,
        SelectInputComponent,
        PropertyFilterComponent,
        OperatorSelectComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
