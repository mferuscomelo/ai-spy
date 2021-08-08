import { Injectable } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class SpeechRecognitionService {
  recognition: SpeechRecognition;
  objectToBeFound: string = '';

  constructor() {
    console.log('Hello');
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;

      console.log('Heard: ' + result);

      // Tokenize result
      const tokenizedResult = result.split(' ');

      // Check if result is a query
      if (tokenizedResult[0] == 'find') {
        this.objectToBeFound = tokenizedResult.slice(2).join(' ');
      }
    };
  }

  ngOnInit(): void {}

  startSpeechRecognition() {
    this.recognition.start();
    console.log('Recognition started');
  }

  endSpeechRecognition() {
    this.recognition.stop();
    console.log('Recognition ended');
  }
}
