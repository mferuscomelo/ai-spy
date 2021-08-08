import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// TODO: update page titles

const routes: Routes = [
  {
    path: '',
    redirectTo: 'scene',
    pathMatch: 'full',
  },
  {
    path: 'scene',
    loadChildren: () =>
      import('./modules/object-detection/object-detection.module').then(
        (m) => m.ObjectDetectionModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
