import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObjectDetectionComponent } from './pages/object-detection/object-detection.component';

const routes: Routes = [{ path: '', component: ObjectDetectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObjectDetectionRoutingModule {}
