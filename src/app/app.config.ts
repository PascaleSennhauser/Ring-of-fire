import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({ "projectId": "ring-of-fire-feff0", "appId": "1:291491316626:web:cc7e67a54a3cadd351774b", "storageBucket": "ring-of-fire-feff0.appspot.com", "apiKey": "AIzaSyCIVHen5ueME4At95Lg2sc_S8u_iD-wpe4", "authDomain": "ring-of-fire-feff0.firebaseapp.com", "messagingSenderId": "291491316626" })), provideFirestore(() => getFirestore())]
};
