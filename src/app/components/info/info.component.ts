import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Details, DataList, DataModel } from 'src/app/models/details.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  areaControl = new FormControl();
  filteredAreaOptions: Observable<string[]>;

  itemControl = new FormControl();
  filteredItemOptions: Observable<string[]>;

  vendorControl = new FormControl();
  filteredVendorOptions: Observable<string[]>;

  displayedColumns: string[] = ['area', 'items', 'vendor', 'contact', 'comments'];
  dataSource = new MatTableDataSource<DataModel>();

  private area: string;
  private item: string;
  private vendor: string;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  public dataList: DataList;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataList = new DataList();
    this.dataService.transformData().then(a => {
       if (a) {
         this.setUpData(a);
       }
       this.filteredAreaOptions = this.areaControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterArea(value))
      );
       this.filteredItemOptions = this.itemControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterItem(value))
      );
       this.filteredVendorOptions = this.vendorControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterVendor(value))
      );
       this.dataSource.paginator = this.paginator;
    });

  }

  public filterBy(value: any, field: string) {
    if (field === 'area') {
      this.area = value;
    } else  if (field === 'item') {
      this.item = value;
    } else  if (field === 'vendor') {
      this.vendor = value;
    }
    this.onSearch();
  }

  public onSearch() {

    let data = this.dataList.dataList;
    console.log(data);
    if (this.area) {
      data = data.filter(a => a.area.indexOf(this.area) > -1);
    }
    if (this.item) {
      data = data.filter(a => a.items.indexOf(this.item) > -1);
    }
    if (this.vendor) {
      data = data.filter(a => a.vendor.includes(this.vendor));
    }
    this.dataSource.data = data;
  }

  private _filterArea(value: string): string[] {
    const filterValue = value.toLowerCase();
    // tslint:disable-next-line: max-line-length
    return this.dataList && this.dataList.areas ? this.dataList.areas.filter(option => option.toLowerCase().indexOf(filterValue) === 0) : [];
  }
  private _filterItem(value: string): string[] {
    const filterValue = value.toLowerCase();
    // tslint:disable-next-line: max-line-length
    return this.dataList && this.dataList.items ? this.dataList.items.filter(option => option.toLowerCase().indexOf(filterValue) === 0) : [];
  }
  private _filterVendor(value: string): string[] {
    const filterValue = value.toLowerCase();
    // tslint:disable-next-line: max-line-length
    return this.dataList && this.dataList.vendors ? this.dataList.vendors.filter(option => option.toLowerCase().indexOf(filterValue) === 0) : [];
  }


  public setUpData(data: DataModel[]) {
    const areas: string[] = [].concat.apply([], data.map(a => a.area));
    this.dataList.areas = [...new Set(areas)];
    const items: string[] = [].concat.apply([], data.map(a => a.items));
    this.dataList.items = [...new Set(items)];
    const vendors: string[] = data.map(a => a.vendor);
    this.dataList.vendors = [...new Set(vendors)];
    this.dataList.dataList = data;

    this.dataSource.data = data;
  }

  public initFilters() {

  }
}
