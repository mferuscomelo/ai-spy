import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencyDetectionRoutingModule } from './currency-detection-routing.module';
import { CurrencyDetectionComponent } from './pages/currency-detection/currency-detection.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CurrencyDetectionComponent],
  imports: [CommonModule, CurrencyDetectionRoutingModule, SharedModule],
})
export class CurrencyDetectionModule {}
