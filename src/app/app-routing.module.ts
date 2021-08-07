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
      import('./modules/scene/scene.module').then((m) => m.SceneModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
