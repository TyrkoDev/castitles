import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-dialog-device-cast',
  templateUrl: './dialog-device-cast.component.html',
  styleUrls: ['./dialog-device-cast.component.css']
})
export class DialogDeviceCastComponent {

  constructor(private _bottomSheetRef: MatBottomSheetRef<DialogDeviceCastComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public devices: any) {}

  chooseDevice(device: string): void {
    this._bottomSheetRef.dismiss(device);
    event.preventDefault();
  }
}