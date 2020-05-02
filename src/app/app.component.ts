import { Component } from '@angular/core';
import $ from "jquery";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public videoElement: any;
  public subtitlesElement: any;
  public device: string = undefined;

  public loadVideo(video: any) {
    if (this.videoElement !== undefined) {
      this.videoElement.remove();
    }
    this.videoElement = video;

    $('#player').prepend(this.videoElement);
    $('video').hide();

    if (this.device === undefined) {
      $('video').show();
      this.videoElement.play();
    }
  }

  public loadSubtitles(subtitles: any) {
    if (this.subtitlesElement !== undefined) {
      this.subtitlesElement.remove();
    }
    this.subtitlesElement = subtitles;
    this.videoElement.append(this.subtitlesElement);
    this.videoElement.textTracks[0].mode = "showing";
  }

  public cast(device?: string): void {
    this.device = device;
    this.device ? $('video').hide() : $('video').show();
  }
}
