import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('shutterIcon') shutterIcon!: ElementRef<HTMLElement>;

  constructor() {}

  ngOnInit(): void {}

  capture() {
    this.shutterIcon.nativeElement.classList.add('clicked');
    navigator.vibrate(50);
    setTimeout(() => {
      this.shutterIcon.nativeElement.classList.remove('clicked');
    }, 50);
  }
}
