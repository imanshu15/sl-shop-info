import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { } from 'googlemaps';
import { PharmacyModel, PharmacyList } from 'src/app/models/details.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PharmacyDetailsComponent } from '../pharmacy-details/pharmacy-details.component';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.scss']
})
export class PharmacyComponent implements OnInit, AfterViewInit  {

  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;
  map: google.maps.Map;
  lat = 7.8731;
  lng = 80.7718;
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 8,
  };
  marker: google.maps.Marker;
  geocoder: google.maps.Geocoder;

  districtControl = new FormControl();
  filteredDistrictOptions: Observable<string[]>;

  areaControl = new FormControl();
  filteredAreaOptions: Observable<string[]>;

  pharmacyControl = new FormControl();
  filteredPharmacyOptions: Observable<string[]>;

  displayedColumns: string[] = ['district', 'area', 'name', 'address', 'details'];
  dataSource = new MatTableDataSource<PharmacyModel>();

   district: string;
   area: string;
   pharmacy: string;
   locationEnabled = false;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  public dataList: PharmacyList;
  markers = [];

  constructor(private dataService: DataService, private bottomSheet: MatBottomSheet) { }

  ngOnInit() {
    this.dataList = new PharmacyList();
    this.dataService.transformData2().then(a => {
      if (a) {
        this.setUpData(a)
        this.dataList.dataList = a;
        // this.setMarkers();

        this.filteredDistrictOptions = this.districtControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterDistrict(value))
        );
        this.filteredAreaOptions = this.areaControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterArea(value))
        );
        this.filteredPharmacyOptions = this.pharmacyControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterPharmacy(value))
        );
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  onClickRecord(row) {
    this.bottomSheet.open(PharmacyDetailsComponent, {
      data: row,
    });
  }

  public setUpData(data: PharmacyModel[]) {
    const districts: string[] = data.map(a => a.district);
    this.dataList.districts = [...new Set(districts)];
    const areas: string[] = data.map(a => a.area);
    this.dataList.areas = [...new Set(areas)];
    const names: string[] = data.map(a => a.name);
    this.dataList.pharmacys = [...new Set(names)];

    this.dataList.dataList = data;

    this.dataSource.data = data;
  }

  // viewOnMap() {
  //   this.setMarkers(this.dataSource.data);
  // }

  public filterBy(value: any, field: string) {
    if (field === 'area') {
      this.area = value;
    } else  if (field === 'district') {
      this.district = value;
    } else  if (field === 'pharmacy') {
      this.pharmacy = value;
    }
    this.onSearch();
  }

  public onSearch() {

    let data = this.dataList.dataList;

    if (this.area) {
      data = data.filter(a => a.area.indexOf(this.area) > -1);
    }
    if (this.district) {
      data = data.filter(a => a.district.indexOf(this.district) > -1);
    }
    if (this.pharmacy) {
      data = data.filter(a => a.name.includes(this.pharmacy));
    }
    this.dataSource.data = data;
   // this.setMarkers();
  }

  public onReset() {
    this.areaControl.reset(); this.area = null;
    this.districtControl.reset(); this.district = null;
    this.pharmacyControl.reset(); this.pharmacy = null;
    this.onSearch();
  }

  private _filterDistrict(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();
      // tslint:disable-next-line: max-line-length
      return this.dataList && this.dataList.districts ? this.dataList.districts.filter(option => option && option.toLowerCase().indexOf(filterValue) === 0) : [];
    } else {
      return this.dataList && this.dataList.districts ? this.dataList.districts : [];
    }
  }
  private _filterArea(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();
      // tslint:disable-next-line: max-line-length
      return this.dataList && this.dataList.areas ? this.dataList.areas.filter(option => option && option.toLowerCase().indexOf(filterValue) === 0) : [];
    } else {
      return this.dataList && this.dataList.areas ? this.dataList.areas : [];
    }
  }
  private _filterPharmacy(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();
      // tslint:disable-next-line: max-line-length
      return this.dataList && this.dataList.pharmacys ? this.dataList.pharmacys.filter(option => option && option.toLowerCase().indexOf(filterValue) === 0) : [];
    } else {
      return this.dataList && this.dataList.pharmacys ? this.dataList.pharmacys : [];
    }
  }

  ngAfterViewInit() {
    this.geocoder = new google.maps.Geocoder();
    this.mapInitializer();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.locationEnabled = true;
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        const location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.map.panTo(location);

        this.map.setZoom(15);

        if (!this.marker) {
          const image = 'https://img.icons8.com/nolan/60/street-view.png';
          this.marker = new google.maps.Marker({
            position: location,
            map: this.map,
            animation: google.maps.Animation.DROP,
            title: 'You are here',
            icon: image
          });
        } else {
          this.marker.setPosition(location);
        }

      });
    } else {
      console.log('Location not enabled');
    }
   }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
   }

   setMarkers(pharmcy: PharmacyModel) {
     if (pharmcy) {
          // tslint:disable-next-line: only-arrow-functions
          this.geocoder.geocode({address: pharmcy.address}, function(results, status) {
            if (status === 'OK') {
              this.setMarker(results, pharmcy.name);
            } else {
              console.log('ERROR', status);
            }
          }.bind(this));
      }
   }


   setMarker(results, name) {
     const image = 'https://img.icons8.com/color/30/000000/clinic.png';
     const marker = new google.maps.Marker({
      position: results[0].geometry.location,
      map: this.map,
      title: name,
      icon: image
    });

     this.markers.push(marker);
     this.setMapBounds();
  }

  deleteMarkers() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  setMapBounds() {
    const temp = [];
    temp.push(this.marker);
    temp.push(this.markers[0]);

    const bounds = new google.maps.LatLngBounds();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < temp.length; i++) {
    bounds.extend(temp[i].getPosition());
    }

    this.map.fitBounds(bounds);
  }
}
