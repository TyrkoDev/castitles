import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerService } from './file-manager/file-manager.service';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  providers: [FileManagerService]
})
export class ServiceModule { }
