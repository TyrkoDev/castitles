import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FileManagerService } from '../service/file-manager/file-manager.service';

@Injectable()
export class ControlsService {
  readonly url = 'http://localhost:3000/cast';

  constructor(private httpServer: HttpClient, private fileManagerService: FileManagerService) { }

  getDevice(): Observable<string> {
    return this.httpServer.get<string>(`${this.url}/device`);
  }

  getDevices(): Observable<string[]> {
    return this.httpServer.get<string[]>(`${this.url}/devices`);
  }

  chooseDevice(device: String): Observable<void> {
    return this.httpServer.post<void>(`${this.url}/choose-device`, { device });
  }

  launchMedia(video: String): Observable<void> {
    return this.httpServer.post<void>(`${this.url}/launch-media`, { video });
  }

  launchMediaWithSubtitles(video: String, subtitles: string, time: number): Observable<void> {
    return this.httpServer.post<void>(`${this.url}/launch-media-with-subtitles`, { video, subtitles: subtitles.split('.').slice(0, -1).join('.'), startTime: time });
  }

  play(): Observable<void> {
    return this.httpServer.post<void>(`${this.url}/play`, {});
  }

  pause(): Observable<void> {
    return this.httpServer.post<void>(`${this.url}/pause`, {});
  }

  stop(): Observable<void> {
    return this.httpServer.post<void>(`${this.url}/stop`, {});
  }

  goTo(time: number): Observable<void> {
    return this.httpServer.post<void>(`${this.url}/go-to/${time}`, {});
  }
}
