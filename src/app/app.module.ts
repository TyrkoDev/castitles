import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { ServiceModule } from './service/service.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlsComponent } from './controls/controls.component';
import { TimeSliderComponent } from './time-slider/time-slider.component';
import { AdviceComponent } from './advice/advice.component';
import { ControlsService } from './controls/controls.service';
import { DialogDeviceCastComponent } from './dialog-device-cast/dialog-device-cast.component';

@NgModule({
  declarations: [
    AppComponent,
    ControlsComponent,
    TimeSliderComponent,
    AdviceComponent,
    DialogDeviceCastComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatToolbarModule,
    ServiceModule,
    SharedModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatListModule
  ],
  providers: [ControlsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
