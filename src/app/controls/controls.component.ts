import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import VTTConverter from 'srt-webvtt';
import { MatSlider } from '@angular/material/slider';
import { Time } from '../shared/time';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AdviceComponent } from '../advice/advice.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  public videoElement: any;
  public subtitlesElement: any;

  public isPaused: boolean = true;
  public isMute: boolean = false;
  public isFullscreen: boolean = false;
  public statusCast: boolean = false;
  public currentTime: String = "00:00:00";
  public totalDuration: String = "00:00:00";

  @Output() video: EventEmitter<any> = new EventEmitter();
  @Output() subtitles: EventEmitter<any> = new EventEmitter();


  constructor(private _snackBar: MatSnackBar, private titleService: Title) {}

  ngOnInit(): void {
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !this.isFullscreen;
    });
    document.body.onkeyup = (e) => {
      e.preventDefault();
      if (e.keyCode == 32) {
        this.pause();
      }
    }
  }

  public pause(): void {
    if (this.isPaused) {
      this.videoElement.play();
      this.isPaused = false;
    } else {
      this.videoElement.pause();
      this.isPaused = true;
    }
  }

  public mute(): void {
    if (this.isMute) {
      this.videoElement.muted = false;
      this.isMute = false;
    } else {
      this.videoElement.muted = true;
      this.isMute = true;
    }
  }

  public fullscreen(): void {
    if (this.isFullscreen) {
      document.exitFullscreen();
    } else {
      document.getElementById('player').requestFullscreen();
    }
  }

  public volume(slider: MatSlider): void {
    const volume = slider.value / 10;
    this.videoElement.volume = volume;
  }

  public loadVideo(file: any): void {
    if (file.target.files && file.target.files[0]) {
      this.createVideoElement(file.target.files[0]);
    } else {
      this.toast(5000, 'An error occured trying to open video');
    }
  }

  public loadSubtitles(file: any): void {
    if (file.target.files && file.target.files[0]) {
      this.createSubtitlesElement(file.target.files[0]);
    } else {
      this.toast(5000, 'An error occured trying to add subtitles');
    }
  }

  private createVideoElement(file: any) {
    this.videoElement = document.createElement('video');
    this.videoElement.src = URL.createObjectURL(file);
    this.videoElement.setAttribute('type', 'video/mp4');
    this.videoElement.onerror = () => {
      this.videoElement.error.code === 4 ? this.toast(5000, 'Video not supported') : this.toast(5000, 'Unknown error occured while loading video');
    }
    this.video.emit(this.videoElement);
    if (this.subtitlesElement !== undefined) {
      this.subtitles.emit(this.subtitlesElement);
    }

    this.isPaused = false;
    this.setupTimer();
    this.videoElement.ondurationchange = () => {
      this.totalDuration = Time.timeToString(this.videoElement.duration);
    };
    this.videoElement.addEventListener('dblclick', (e) => {
      this.fullscreen();
    });
    this.videoElement.addEventListener('click', (e) => {
      this.pause();
    });

    this.toast(3000, file.name);
    this.titleService.setTitle('Castitles - ' + file.name);
  }

  private setupTimer() {
    setInterval(() => {
      this.currentTime = Time.timeToString(this.videoElement.currentTime);
    }, 1000);
  }

  private createSubtitlesElement(file: any) {
    const vttConverter = new VTTConverter(file);

    vttConverter
      .getURL()
      .then((url: any) => {
        this.subtitlesElement = document.createElement("track");
        this.subtitlesElement.kind = "captions";
        this.subtitlesElement.label = "English";
        this.subtitlesElement.srclang = "en";
        this.subtitlesElement.src = url;

        if (this.videoElement !== undefined) {
          this.subtitles.emit(this.subtitlesElement);
        }

        this.toast(2000, 'Subtitles loaded');
      })
      .catch((err) => {
        console.error(err);
      });
  }

  public toast(duration: number, data: any): void  {
    this._snackBar.openFromComponent(AdviceComponent, {
      duration: duration,
      data: data,
      verticalPosition: <MatSnackBarVerticalPosition>'top'
    });
  }
}
