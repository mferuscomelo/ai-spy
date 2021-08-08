import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss'],
})
export class StatusDialogComponent implements OnInit {
  @Input() icon: 'success' | 'warning' | 'error' = 'error';

  @HostBinding('class') get HeadingClass() {
    return this.icon;
  }

  constructor() {}

  ngOnInit(): void {}
}
