import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-currency-detection',
  templateUrl: './currency-detection.component.html',
  styleUrls: ['./currency-detection.component.scss'],
})
export class CurrencyDetectionComponent implements OnInit {
  @ViewChild('video')
  public videoElement!: ElementRef<HTMLVideoElement>;

  @ViewChild('canvas')
  public canvasElement!: ElementRef<HTMLCanvasElement>;

  loadingMessage = 'Initializing';
  isLoaded = false;

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
      this.loadingMessage = 'Starting Webcam';

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'environment' },
      });

      const video = this.videoElement.nativeElement;

      video.srcObject = stream;
      video.play();

      console.log('Successfully started webcam');
    } catch (error) {
      console.log('Error starting webcam');
      // TODO: display error message to user
    }
  }

  async startPredictions() {
    try {
      this.loadingMessage = 'Loading model';

      const model = await tf.loadLayersModel(
        '/assets/models/tfjs/currency-detector/model.json'
      );
      console.log('Successfully loaded model');
      this.isLoaded = true;
      this.parseFrame(this.videoElement.nativeElement, model);
    } catch (error) {
      console.error('Error loading model');
      console.error(error);
    }
  }

  async parseFrame(video: HTMLVideoElement, model: tf.LayersModel) {
    const img = tf.browser
      .fromPixels(video)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .expandDims();
    const predictions = model.predict(img) as tf.Tensor<tf.Rank>[];
    // this.renderPredictions(predictions);
    requestAnimationFrame(() => {
      this.parseFrame(video, model);
    });
  }

  async renderPredictions(predictions: any) {
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

    predictions.forEach((prediction: any) => {
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
