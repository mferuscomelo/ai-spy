import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SceneRoutingModule } from './scene-routing.module';
import { SceneComponent } from './pages/scene/scene.component';
import { ObjectDetectionComponent } from './components/object-detection/object-detection.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SceneComponent, ObjectDetectionComponent],
  imports: [CommonModule, SceneRoutingModule, SharedModule],
})
export class SceneModule {}
