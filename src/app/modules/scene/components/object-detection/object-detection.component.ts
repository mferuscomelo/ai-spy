import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSSD from '@tensorflow-models/coco-ssd';

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

  constructor() {}

  ngOnInit(): void {
    this.initObjectDetection();
  }

  async initObjectDetection() {
    await this.initWebcam();
    await this.startPredictions();
  }

  async initWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user' },
      });

      this.videoElement.nativeElement.srcObject = stream;
      this.videoElement.nativeElement.play();

      console.log('Successfully started webcam');
      // this.videoElement.onloadedmetadata = () => {
      // };
    } catch (error) {
      console.log('Error starting webcam');
    }
  }

  async startPredictions() {
    try {
      const model = await cocoSSD.load({
        base: 'mobilenet_v2',
      });
      console.log('Successfully loaded model');
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

    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const w = prediction.bbox[2];
      const h = prediction.bbox[3];

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
    });
  }
}
