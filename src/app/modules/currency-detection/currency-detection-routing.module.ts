import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyDetectionComponent } from './pages/currency-detection/currency-detection.component';

const routes: Routes = [{ path: '', component: CurrencyDetectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrencyDetectionRoutingModule {}
