import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilterStep } from '../model/filter-data.model';

@Injectable({
    providedIn: 'root'
})
export class FilterDataService {

    constructor(private http: HttpClient) { }

    loadFilters() {
        return this.http
            .get<FilterStep[]>('https://pedroclayman.github.io/customer-filter-data/data.json');
    }
}
