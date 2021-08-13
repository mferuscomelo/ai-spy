import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSSD from '@tensorflow-models/coco-ssd';
import { MatDialog } from '@angular/material/dialog';
import { PermissionsDialogComponent } from '../../components/permissions-dialog/permissions-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpeechRecognitionService } from 'src/app/shared/services/speech-recognition.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'object-detection',
  templateUrl: './object-detection.component.html',
  styleUrls: ['./object-detection.component.scss'],
})
export class ObjectDetectionComponent implements OnInit {
  @ViewChild('video')
  public videoElement!: ElementRef<HTMLVideoElement>;

  @ViewChild('canvas')
  public canvasElement!: ElementRef<HTMLCanvasElement>;

  loadingMessage = 'Initializing';
  isLoaded = false;
  isFound = false;
  isSayingDirections = false;
  icon: 'success' | 'warning' | 'error' = 'error';

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public speechRecognitionService: SpeechRecognitionService,
    private analytics: AngularFireAnalytics
  ) {}

  ngOnInit(): void {
    this.initObjectDetection();
  }

  async initObjectDetection() {
    try {
      await this.getPermissions();
    } catch (error) {
      console.error(`Couldn't get required permissions`);
      this.showWarning(
        'Could not get the required permissions. This app may not work properly.'
      );
      return;
    }

    try {
      await this.initWebcam();
    } catch (error) {
      console.error(`Couldn't start camera`);
      this.showWarning(
        'Could not start the camera. This app may not work properly.'
      );
      return;
    }

    await this.startPredictions();
  }

  async getPermissions() {
    return await new Promise<void>(async (resolve, reject) => {
      // Check if we have permission
      if (!(await this.isPermissionGranted())) {
        // We need to ask for permission
        this.dialog
          .open(PermissionsDialogComponent, {
            disableClose: true,
          })
          .afterClosed()
          .subscribe(async (result) => {
            console.log('result: ', result);
            if (result) {
              // We can prompt for permissions
              try {
                await navigator.mediaDevices.getUserMedia({
                  audio: true,
                  video: true,
                });
                resolve();
              } catch (error) {
                reject();
              }
            } else {
              // Permissions have been denied
              reject();
            }
          });
      } else {
        resolve();
      }
    });
  }

  async initWebcam() {
    return await new Promise<void>(async (resolve, reject) => {
      this.loadingMessage = 'Starting Webcam';

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'environment' },
      });

      const video = this.videoElement.nativeElement;

      video.srcObject = stream;
      video.onloadeddata = () => {
        video.play();
      };

      console.log('Successfully started webcam');
      resolve();
    });
  }

  async startPredictions() {
    try {
      this.loadingMessage = 'Loading model';

      const model = await cocoSSD.load({
        base: 'lite_mobilenet_v2',
      });

      console.log('Successfully loaded model');
      this.isLoaded = true;
      this.parseFrame(this.videoElement.nativeElement, model);
    } catch (error) {
      console.error('Error loading model');
      console.error(error);
    }
  }

  async parseFrame(video: HTMLVideoElement, model: cocoSSD.ObjectDetection) {
    const predictions = await model.detect(video);
    this.renderPredictions(predictions);
    requestAnimationFrame(() => {
      this.parseFrame(video, model);
    });
  }

  async renderPredictions(predictions: cocoSSD.DetectedObject[]) {
    this.icon = 'error';

    const canvas = this.canvasElement.nativeElement;
    const video = this.videoElement.nativeElement;

    const ctx = canvas.getContext('2d')!;

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const font = '16px sans-serif';
    ctx.font = font;
    ctx.textBaseline = 'top';
    ctx.drawImage(video, 0, 0, width, height);

    const objectToBeFound = this.speechRecognitionService.objectToBeFound;
    if (objectToBeFound == '') {
      // If object hasn't been found, show all object labels
      predictions.forEach((prediction) => {
        this.displayBoundingBox(prediction, ctx, font);

        if (prediction.class == objectToBeFound) {
          this.foundObject(prediction.class);
        }
      });
    } else {
      // Else show only the found object label
      const prediction = predictions.find(
        (prediction) => prediction.class == objectToBeFound
      );
      if (prediction) {
        this.displayBoundingBox(prediction, ctx, font);

        if (prediction.class == objectToBeFound) {
          this.foundObject(prediction.class);
        }

        if (this.isFound) {
          // Get the quadrant which the object is in
          // -1: Left
          // 0: Centered
          // 1: Right
          const quadrant = this.getQuadrant(prediction, 0.05);

          if (!this.isSayingDirections) {
            this.navigateUser(quadrant);
          }
        }
      }
    }
  }

  // QUESTION: Object being "found" every few seconds. How to solve?
  foundObject(label: string) {
    this.icon = 'success';

    // Vibrate only if the object is in frame for 2 seconds
    setTimeout(() => {
      if (this.icon == 'success' && !this.isFound) {
        navigator.vibrate(500);
        this.isFound = true;

        const msg = new SpeechSynthesisUtterance(`${label} found`);
        window.speechSynthesis.speak(msg);

        this.analytics.logEvent('found_object', {
          object_name: label,
        });
      }
    }, 2000);
  }

  getBoundingBox(prediction: cocoSSD.DetectedObject) {
    const x = prediction.bbox[0];
    const y = prediction.bbox[1];
    const w = prediction.bbox[2];
    const h = prediction.bbox[3];

    return { x, y, w, h };
  }

  displayBoundingBox(
    prediction: cocoSSD.DetectedObject,
    ctx: CanvasRenderingContext2D,
    font: string
  ) {
    const { x, y, w, h } = this.getBoundingBox(prediction);

    // Bounding box
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Label background
    ctx.fillStyle = '#00FFFF';
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10); // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

    ctx.fillStyle = '#000000';
    ctx.fillText(prediction.class, x, y);
  }

  getQuadrant(
    prediction: cocoSSD.DetectedObject,
    threshold: number
  ): -1 | 0 | 1 {
    const { x, y, w, h } = this.getBoundingBox(prediction);
    const video = this.videoElement.nativeElement;

    // Calculate the center of the bounding box and normalize the coords
    const bboxCenterX = (x + w / 2) / video.videoWidth;

    if (bboxCenterX > 0.5 + threshold) {
      return 1;
    } else if (bboxCenterX < 0.5 - threshold) {
      return -1;
    } else {
      return 0;
    }
  }

  navigateUser(quadrant: -1 | 0 | 1) {
    this.isSayingDirections = true;

    let directions = '';
    switch (quadrant) {
      case -1:
        directions = 'Turn slightly right';
        break;

      case 0:
        directions = 'Go forward';
        break;

      case 1:
        directions = 'Turn slightly left';
        break;

      default:
        directions = 'Go forward';
        break;
    }

    // Voice
    const msg = new SpeechSynthesisUtterance(directions);
    window.speechSynthesis.speak(msg);
    msg.onend = (event) => {
      this.isSayingDirections = false;
    };
  }

  showWarning(message: string) {
    // SnackBar
    const alert = this.snackBar.open(message);
    setTimeout(() => {
      alert.dismiss();
    }, 2000);

    // Voice
    const msg = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(msg);
  }

  async isPermissionGranted() {
    const cameraPermission = await navigator.permissions.query({
      name: 'camera',
    });

    const microphonePermission = await navigator.permissions.query({
      name: 'microphone',
    });

    return (
      cameraPermission.state == 'granted' &&
      microphonePermission.state == 'granted'
    );
  }
}
