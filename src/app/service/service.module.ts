import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CastService } from './cast/cast.service';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  providers: [CastService]
})
export class ServiceModule { }
