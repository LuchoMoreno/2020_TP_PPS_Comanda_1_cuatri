import { Injectable } from '@angular/core';

// IMPORTO A USUARIOS.
import {Usuario} from '../clases/usuario'

// IMPORTO LOS MENSAJES. CON ESTO USO LOS TOAST.
import { ToastController, LoadingController } from '@ionic/angular';

// IMPORTO EL TIMER:
import { timer } from 'rxjs';

// IMPORTO LA CAMARA 
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

// IMPORTO EL QRSCANNER 
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

// IMPORTO EL PLATFORM 
import { Platform } from '@ionic/angular';
import { stringify } from 'querystring';


@Injectable({
  providedIn: 'root'
})

export class ComplementosService {

  qrScan:any;

  constructor(private complementos : ComplementosService, 
    public toastController: ToastController,
    public loadingController: LoadingController,
    public camera: Camera,
    public qrScanner: QRScanner, 
    public plataform:Platform,
    ) 
    {
      this.plataform.backButton.subscribeWithPriority(0,() => {
        document.getElementsByTagName("body")[0].style.opacity = "1";
        this.qrScan.unsubscribe();
      })
    }



  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      duration: 2000,
      translucent: true,
     // cssClass: 'custom-class custom-loading'
    });
    await loading.present();
  
    const { role, data } = await loading.onDidDismiss();
  
    console.log('Loading dismissed!');
  }
  
  
  // Muestro el toast, mensaje de error. 
  async presentToast(msg) {
    console.log(msg);
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 2000,
      color: 'danger',
    buttons: [
      {
        text: 'Aceptar',
        role: 'cancel',
      }
    ]
  });
  toast.present();
  }
  


// Valido absolutamente todos los posibles errores. 
ngValidarError( err ) {
  console.log(err);
  switch (err) {
      case 'auth/argument-error':
        err = 'ERROR: Debe completar todos los campos';
        break;
      case 'auth/invalid-email':
          err = 'ERROR: Formato de email no correcto';
          break;
      case 'auth/user-not-found':
          err = 'ERROR: Usuario no valido';
          break;
      case 'auth/wrong-password':
            err = 'ERROR: Contraseña incorrecta';
            break;
      default:
        err = 'ERROR';
        break;
    }

this.presentToast(err);
  }


  // Muestro el toast, mensaje de error. 
  async presentToastConMensajeYColor(msg : string, color : string) {
    console.log(msg);
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 2000,
      color: color,
    buttons: [
      {
        text: 'Aceptar',
        role: 'cancel',
      }
    ]
  });
  toast.present();
  }

  capturarYGuardarFoto()
  {

  }

  escanearDni() : string
  {

    let texto : string;

    this.qrScanner.prepare()

    .then((status:QRScannerStatus) => {

      if(status.authorized)
      {

        this.qrScanner.show();
        document.getElementsByTagName("body")[0].style.opacity = "0";

        this.qrScan = this.qrScanner.scan().subscribe((texto) => {
          
        document.getElementsByTagName("body")[0].style.opacity = "1";
        
        alert('Scanned something: ' + texto);
        this.qrScanner.hide(); // hide camera preview
        this.qrScan.unsubscribe(); // stop scanning
        
        this.complementos.presentToastConMensajeYColor(texto + "Desde el servicio", "danger");
        return texto;

        },(err) =>{
          return err;
          alert(JSON.stringify(err));
        })
      }
      else if(status.denied)
      {
        return status.denied;
      }
      else{
        return "Hubo un error!";
      }

    })


    return texto;
    
  }

}








