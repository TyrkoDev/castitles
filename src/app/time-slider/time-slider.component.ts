import { Component, Input } from '@angular/core';
import { MatSlider } from '@angular/material/slider';

@Component({
  selector: 'app-time-slider',
  templateUrl: './time-slider.component.html',
  styleUrls: ['./time-slider.component.css']
})
export class TimeSliderComponent {

  private videoElement: any;
  public timelapsed: number = 0;
  public timeUpdate: any;

  @Input() set video(videoElement: any) {
    if (videoElement !== undefined) {
      this.videoElement = videoElement;
      this.tickTimeSpent();
    }
  }

  public changeTime(slider: MatSlider): void {
    this.timelapsed = slider.value;
    const time = Math.ceil(this.videoElement.duration) * (slider.value / 100);
    this.videoElement.currentTime = time;
    this.tickTimeSpent();
  }

  public tickTimeSpent() {
    clearInterval(this.timeUpdate);
    this.timeUpdate = setInterval(() => this.timelapsed = (this.videoElement.currentTime / this.videoElement.duration) * 100, 1000);
  }
}
