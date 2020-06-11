import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


// ACA IMPORTO LA CONFIGURACION DE MI PROYECTO EN LA CUENTA DE FIREBASE.
import { firebaseConfig } from "../environments/environment";


// IMPORTO MODULOS DE ANGULAR
import { AngularFireModule } from "@angular/fire";

// IMPORTO EL MODULO DE AUTENTIFICACION

import { AngularFireAuthModule} from "@angular/fire/auth";

// IMPORTO EL PLUGIN DE CAMARA
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


// BAR SCANNER.
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

// IMPORTO BASE DE DATOS FIREBASE
import {AngularFirestore} from "@angular/fire/firestore";

import {AngularFireStorageModule} from "@angular/fire/storage";


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    AngularFireStorageModule, // <- Agregue
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    BarcodeScanner,
    AngularFirestore,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
