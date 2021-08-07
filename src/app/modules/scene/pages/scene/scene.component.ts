import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
})
export class SceneComponent implements OnInit {
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
