import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

declare var cast, chrome: any;

@Injectable()
export class FileManagerService {

  readonly url = 'http://localhost:3000/file-manager/';
  
  constructor(private httpServer: HttpClient) { }

  uploadFile(file: any): Observable<void> {
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.httpServer.post<void>(this.url, formData);
  }
}
