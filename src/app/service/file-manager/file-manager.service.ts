import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FileManagerService {

  readonly url = 'http://localhost:3000/file-manager/';

  constructor(private httpServer: HttpClient) { }

  uploadFile(file: any): Observable<void> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.httpServer.post<void>(this.url, formData);
  }
}
