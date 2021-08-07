import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
  { path: 'currency', loadChildren: () => import('./modules/currency-detection/currency-detection.module').then(m => m.CurrencyDetectionModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
