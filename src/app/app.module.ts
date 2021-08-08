import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

import { AngularFireModule } from '@angular/fire';
import {
  AngularFireAnalyticsModule,
  ScreenTrackingService,
} from '@angular/fire/analytics';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    BrowserAnimationsModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
  ],
  providers: [ScreenTrackingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
