import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ObjectDetectionRoutingModule } from './object-detection-routing.module';
import { ObjectDetectionComponent } from './pages/object-detection/object-detection.component';

@NgModule({
  declarations: [ObjectDetectionComponent],
  imports: [CommonModule, ObjectDetectionRoutingModule, SharedModule],
})
export class ObjectDetectionModule {}
