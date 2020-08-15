import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public device: string = undefined;

  public cast(device?: string): void {
    this.device = device;
  }
}
