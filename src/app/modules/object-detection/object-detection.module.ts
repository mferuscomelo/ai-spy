import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ObjectDetectionRoutingModule } from './object-detection-routing.module';
import { ObjectDetectionComponent } from './pages/object-detection/object-detection.component';
import { PermissionsDialogComponent } from './components/permissions-dialog/permissions-dialog.component';

@NgModule({
  declarations: [ObjectDetectionComponent, PermissionsDialogComponent],
  imports: [CommonModule, ObjectDetectionRoutingModule, SharedModule],
})
export class ObjectDetectionModule {}
