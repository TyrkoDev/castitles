import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import VTTConverter from 'srt-webvtt';
import { MatSlider } from '@angular/material/slider';
import { Time } from '../shared/time';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AdviceComponent } from '../advice/advice.component';
import { Title } from '@angular/platform-browser';
import { FileManagerService } from '../service/file-manager/file-manager.service';
import { ControlsService } from './controls.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DialogDeviceCastComponent } from '../dialog-device-cast/dialog-device-cast.component';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  public videoElement: any;
  public subtitlesElement: any;
  public videoFile: string = undefined;
  public subtitlesFile: string = undefined;

  public device: string;
  public isPaused: boolean = true;
  public isMute: boolean = false;
  public isFullscreen: boolean = false;
  public currentTime: String = "00:00:00";
  public totalDuration: String = "00:00:00";

  @Output() video: EventEmitter<any> = new EventEmitter();
  @Output() subtitles: EventEmitter<any> = new EventEmitter();
  @Output() deviceEmit: EventEmitter<string> = new EventEmitter();


  constructor(private _snackBar: MatSnackBar, 
    private titleService: Title, 
    private fileManagerService: FileManagerService,
    private controlsService: ControlsService,
    private _bottomSheet: MatBottomSheet) {}

  ngOnInit(): void {
    this.controlsService.getDevice().subscribe((device) => {
      if (device !== undefined) {
        this.device = device;
      }
    });

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
      if (this.connected()) {
        this.controlsService.play().subscribe(() => this.isPaused = false);
      } else {
        this.videoElement.play();
        this.isPaused = false;
      }
    } else {
      if (this.connected()) {
        this.controlsService.pause().subscribe(() => this.isPaused = true);
      } else {
        this.videoElement.pause();
        this.isPaused = true;
      }
    }
  }

  public stop(): void {
    if (this.connected()) {
      this.controlsService.stop().subscribe(() => {
        this.device = undefined;
        this.deviceEmit.emit();
      });
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

  public cast(): void {
    if (!this.connected()) {
      this.controlsService.getDevices().subscribe(devices => {
        const dialog = this._bottomSheet.open(DialogDeviceCastComponent, {
          data: devices
        });
        dialog.afterDismissed().subscribe(device => {
          this.device = device;
          this.controlsService.chooseDevice(device).subscribe(() => this.deviceEmit.emit(device));
        });
      });
    } else {
      this.deviceEmit.emit();
      this.device = undefined;
    }
  }

  public connected(): boolean {
    return this.device !== undefined && this.device !== null && this.device !== '';
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

  private initControls() {
    this.isPaused = false;
    this.setupTimer();
    this.toast(3000, this.videoFile);
    this.titleService.setTitle('Castitles - ' + this.videoFile);
  }

  private createVideoElement(file: any) {
    this.videoFile = file.name;
    if (this.connected()) {
      this.fileManagerService.uploadFile(file).subscribe(() => {
        this.subtitlesFile !== undefined ? 
        this.controlsService.launchMediaWithSubtitles(file.name, this.subtitlesFile, 0).subscribe(() => this.initControls()) :
        this.controlsService.launchMedia(file.name).subscribe(() => this.initControls());
      });
    }
      
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

    this.initControls();

    this.videoElement.ondurationchange = () => {
      this.totalDuration = Time.timeToString(this.videoElement.duration);
    };
    this.videoElement.addEventListener('dblclick', (e) => {
      this.fullscreen();
    });
    this.videoElement.addEventListener('click', (e) => {
      this.pause();
    });
  }

  private setupTimer() {
    setInterval(() => {
      this.currentTime = this.connected() ? '--:--:--' : Time.timeToString(this.videoElement.currentTime);
    }, 1000);
  }

  private createSubtitlesElement(file: any) {
    const vttConverter = new VTTConverter(file);
    this.subtitlesFile = file.name;
    
    if (this.connected()) {
      this.fileManagerService.uploadFile(file).subscribe(() => {
        if (this.videoElement !== undefined) {
          this.controlsService.launchMediaWithSubtitles(this.videoFile, this.subtitlesFile, 0).subscribe();
        }
      });
    }

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
