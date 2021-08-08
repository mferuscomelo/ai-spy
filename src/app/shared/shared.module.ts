import { NgModule } from '@angular/core';
import { IconsModule } from './icons.module';
import { MaterialModule } from './material.module';
import { StatusDialogComponent } from './components/status-dialog/status-dialog.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [StatusDialogComponent],
  imports: [CommonModule, IconsModule, MaterialModule],
  exports: [IconsModule, MaterialModule, StatusDialogComponent],
})
export class SharedModule {}
