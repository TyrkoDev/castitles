import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
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
  public videoFile: string = undefined;
  public subtitlesFile: string = undefined;

  public device: string;
  public isPaused = true;
  public isMute = false;
  public isFullscreen = false;
  public isHealthy = true;
  public currentTime = '00:00:00';
  public totalDuration = '00:00:00';
  public checkHealthUpdate: any;

  @Output() deviceEmit: EventEmitter<string> = new EventEmitter();


  constructor(private snackBar: MatSnackBar,
              private titleService: Title,
              private fileManagerService: FileManagerService,
              private controlsService: ControlsService,
              private bottomSheet: MatBottomSheet) {}

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
      if (e.keyCode === 32) {
        this.pause();
      }
    };
  }

  public pause(): void {
    if (this.connected()) {
      this.isPaused ?
        this.controlsService.play().subscribe(() => this.isPaused = false) :
        this.controlsService.pause().subscribe(() => this.isPaused = true);
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
    this.isMute = !this.isMute;
  }

  public cast(): void {
    if (!this.connected()) {
      this.controlsService.getDevices().subscribe(devices => {
        const dialog = this.bottomSheet.open(DialogDeviceCastComponent, {
          data: devices
        });
        dialog.afterDismissed().subscribe(device => {
          this.device = device;
          this.controlsService.chooseDevice(device).subscribe(() => this.deviceEmit.emit(device));
          this.checkHealthUpdate = setInterval(() =>
            this.controlsService.healthCheckDevice(device).subscribe(health => this.isHealthy = health), 1000);
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

  public volume(slider: MatSliderChange): void {
    // this.videoElement.volume = slider.value / 10;
  }

  public loadVideo(file: any): void {
    file.target.files && file.target.files[0] ?
      this.sendVideo(file.target.files[0]) :
      this.toast(5000, 'An error occured trying to open video');
  }

  public loadSubtitles(file: any): void {
    file.target.files && file.target.files[0] ?
      this.sendSubtitles(file.target.files[0]) :
      this.toast(5000, 'An error occured trying to add subtitles');
  }

  private initControls() {
    this.isPaused = false;
    this.setupTimer();
    this.toast(3000, this.videoFile);
    this.titleService.setTitle('Castitles - ' + this.videoFile);
  }

  private sendVideo(file: any) {
    this.videoFile = file.name;
    if (this.connected()) {
      this.fileManagerService.uploadFile(file).subscribe(() => {
        this.subtitlesFile !== undefined ?
        this.controlsService.launchMediaWithSubtitles(file.name, this.subtitlesFile, 0).subscribe(() => this.initControls()) :
        this.controlsService.launchMedia(file.name).subscribe(() => this.initControls());
      });
    }

    this.initControls();
  }

  private setupTimer() {
    setInterval(() => {
      this.currentTime = this.connected() ? '--:--:--' : Time.timeToString(this.videoElement.currentTime);
    }, 1000);
  }

  private sendSubtitles(file: any) {
    this.subtitlesFile = file.name;

    if (this.connected()) {
      this.fileManagerService.uploadFile(file).subscribe(() => this.toast(3000, this.subtitlesFile));
    }
  }

  public toast(duration: number, data: any): void  {
    this.snackBar.openFromComponent(AdviceComponent, {
      duration,
      data,
      verticalPosition: 'top' as MatSnackBarVerticalPosition
    });
  }
}
