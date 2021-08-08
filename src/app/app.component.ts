import { Component, ElementRef, ViewChild } from '@angular/core';
import { SpeechRecognitionService } from './shared/services/speech-recognition.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('speechRecognitionIcon')
  speechRecognitionIcon!: ElementRef<HTMLElement>;

  constructor(private speechRecognitionService: SpeechRecognitionService) {}

  ngOnInit(): void {}

  startSpeechRecognition() {
    this.speechRecognitionIcon.nativeElement.classList.add('pressed');
    this.speechRecognitionService.startSpeechRecognition();
    navigator.vibrate(50);
  }

  endSpeechRecognition() {
    this.speechRecognitionIcon.nativeElement.classList.remove('pressed');
    this.speechRecognitionService.endSpeechRecognition();
    navigator.vibrate(50);
  }
}
