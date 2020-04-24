import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

declare var cast, chrome: any;

@Injectable()
export class CastService {
  private cast;
  private status : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  initializeCastApi() {
    const sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
    const apiConfig = new chrome.cast.ApiConfig(sessionRequest,
      function(session) {
        console.log('got session', session)
        this.cast = session
      },
      function(e) {
        if (e === chrome.cast.ReceiverAvailability.AVAILABLE) {
          console.log('receiver is available :)')
        }
      }, sessionRequest);

    chrome.cast.initialize(apiConfig, 
      () => console.log('got initSuccess'),
      (gotError) => console.log('gotError', gotError));
  };

  public onInitSuccess(e) {
    console.log('GCast initialization success');
  }

  public onError(err) {
    console.log('GCast initialization failed', err);
  }

  public discoverDevices(): void {
    const sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
    chrome.cast.requestSession(
      (s) => {
        console.log(s);
        this.cast = s;
        this.status.next(true);
      }, 
      (err) => {
        if (err.code === 'cancel') {
          this.status.next(false);
        } else {
          console.error('Error selecting a cast device', err);
        }
    }, sessionRequest);
  };

  public launchMedia(media) {
    console.log('launch media with session', this.cast.session);
    console.log(media);
    let mediaInfo = new chrome.cast.media.MediaInfo(media, 'video/mp4');;
    let request = new chrome.cast.media.LoadRequest(mediaInfo);
    this.cast.loadMedia(request, this.onMediaDiscovered.bind(this, 'loadMedia'), this.onMediaError);
    // let player = new this.cast.framework.RemotePlayer();
    // let playerController = new this.cast.framework.RemotePlayerController(player);

    // playerController.playOrPause();
    return true;
  };

  public onMediaDiscovered(how, media) {
    console.log('Start media', media);
    this.cast.currentMedia = media;
  }

  public onMediaError(err) {
    console.error('Error launching media', err);
  };

  public stop() {
    const castSession = this.cast.framework.CastContext.getInstance().getCurrentSession();
    castSession.endSession(true);
  };

  public getStatus(): Observable<boolean> {
    return this.status.asObservable();
  }

}
