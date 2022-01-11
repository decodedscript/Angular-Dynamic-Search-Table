import { Component, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms'; 
declare var alasql: any;
import * as XLSX from 'xlsx';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  displayedColumns: string[] = ['name', 'country', 'currency', 'email', 'pin'];
  dataSource = new MatTableDataSource<any>();

  keyupSub: Subscription;
  countriesSub: Subscription;
  searchControl = new FormControl();
  workSheets: any[] = [];
  constructor(protected _http: HttpClient) {

  }
  ngOnInit() {
    this.getCountries();
    this.subSearchBoxChanges(); 
  }
  subSearchBoxChanges() {
    this.keyupSub = this.searchControl.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((val: string) => {
      this.applyFilter(val);
    });
  }
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue;
  }
  getCountries() {
    this._http.get<any[]>("/assets/country.json").subscribe(res => {
      this.dataSource.data = res;
    })
  }
  ngOnDestroy() {
    this.keyupSub.unsubscribe();
    this.countriesSub.unsubscribe();
  }
 
}
