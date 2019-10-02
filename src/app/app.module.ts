import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { FilterFunnelComponent } from './filter-funnel/filter-funnel.component';
import { FilterStepComponent } from './filter-step/filter-step.component';

@NgModule({
    declarations: [
        AppComponent,
        FilterFunnelComponent,
        FilterStepComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
