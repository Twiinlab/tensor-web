import {
  Component, Input, ElementRef, AfterViewInit, OnInit, ViewChild
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2'; // for methods
// import * as firebase from 'firebase'; // for typings
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';

import { ImagesService} from '../../services/images.service';
import { AuthService} from '../../services/auth.service';

import { environment } from '../../../environments/environment';

declare var firebase: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('myBoard') public canvas: ElementRef;
  @ViewChild('downloadButton') public downloadButton: ElementRef;

  @Input() public width = 400;
  @Input() public height = 400;

  items: any;

  auth: any;
  database: any;
  storage: any;

  authState: any;
  predictionAnswer = [];
  maxValue: any;

  categoryList = ['duck', 'smile', 'car', 'pencil', 'star', 'burger', 'cookie', 'rabbit', 'moon', 'icecream'];

  private cx: CanvasRenderingContext2D;

  constructor(
    private imagesService: ImagesService
    // private authService: AuthService,
    // private fb: FirebaseApp,
    // private ngstore: AngularFirestore,
    // private af: AngularFireAuth
  ) { }


  public ngOnInit() {
    // this.items = this.ngstore.collection('items').valueChanges();
    // this.initFirebase();
  }

  public initFirebase() {
    // firebase.initializeApp(environment.firebase);

    // Get a reference to the storage service, which is used to create references in your storage bucket
    // this.auth = firebase.auth();
    // this.database = firebase.database();
    // this.storage = firebase.storage();
    // this.authService.anonymousLogin();
    // this.af.authState.subscribe((auth) => {
    //   this.authState = auth;
    // });
  }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 10;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }

  private onClearCanvas() {
    const c = this.canvas.nativeElement;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    const self = this;
    const eventUp = Observable.fromEvent(canvasEl, 'mouseup');

    Observable
      .fromEvent(canvasEl, 'mousedown')
      .switchMap((e) => {
        return Observable
          .fromEvent(canvasEl, 'mousemove')
          .takeUntil(eventUp)
          .pairwise();
      })
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };
        this.drawOnCanvas(prevPos, currentPos);
      });

      eventUp.subscribe( event => {
        debugger;
        console.log('eventUp');
        const dataURL = this.canvas.nativeElement.toDataURL('image/png');
        self.imagesService.sendImage(dataURL)
        .subscribe(result => {
          console.log('prediction' + result.prediction);
          self.predictionAnswer = result.prediction;
          self.maxValue = self.categoryList[self.getHighestValuePosition(result.prediction)];
        });
      });
  }

  private getHighestValuePosition(list) {
    let maxValue = 0;
    list.forEach(value => {
      if (value > maxValue) {
        maxValue = value;
      }
    });
    return list.indexOf(maxValue);
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

}
