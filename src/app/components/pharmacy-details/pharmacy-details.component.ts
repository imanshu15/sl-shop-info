import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PharmacyModel } from 'src/app/models/details.model';

@Component({
  selector: 'app-pharmacy-details',
  templateUrl: './pharmacy-details.component.html',
  styleUrls: ['./pharmacy-details.component.scss']
})
export class PharmacyDetailsComponent implements OnInit {

  public dataModel: PharmacyModel;
  // tslint:disable-next-line: variable-name
  constructor(private _bottomSheetRef: MatBottomSheetRef<PharmacyDetailsComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    if (data) {
      console.log(data);
      this.dataModel = data;
    }
  }

  ngOnInit(): void {
  }

  onClose(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
