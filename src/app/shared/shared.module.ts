import { NgModule } from '@angular/core';
import { IconsModule } from './icons.module';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [IconsModule, MaterialModule],
  exports: [IconsModule, MaterialModule],
})
export class SharedModule {}
