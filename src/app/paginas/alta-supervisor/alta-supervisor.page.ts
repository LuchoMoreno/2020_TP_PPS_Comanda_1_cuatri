import { Component, OnInit, Input } from '@angular/core';
import { ComplementosService } from 'src/app/servicios/complementos.service';

// QR

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

// PLATFORM

// IMPORTO EL PLATFORM 
import { Platform } from '@ionic/angular';
import { stringify } from 'querystring';

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
})

export class AltaSupervisorPage implements OnInit {


  // GLOBALES
  qrScan:any;


  // Variables 
  nombre : string;
  apellido : string;
  @Input() dni  : string ;
  cuil : string; 
  foto : string;
  

  constructor(private complementos : ComplementosService, 
    public qrScanner: QRScanner, 
    public plataform:Platform,
    ) 
    {
      this.plataform.backButton.subscribeWithPriority(0,() => {
        document.getElementsByTagName("body")[0].style.opacity = "0";
        this.qrScan.unsubscribe();
      })
    }

  ngOnInit() {
  }


  
  escanearDni()
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
        

        //this.complementos.presentToastConMensajeYColor(texto + "Desde el servicio", "danger");
        //return texto;


        if (texto != null)
        {
          this.dni = texto;
          this.qrScanner.destroy();
          this.dni = this.dni;
        }

        this.dni = this.dni;

        },(err) =>{
          //return err;
          alert(JSON.stringify(err));
        })

      }
      else if(status.denied)
      {
        //return status.denied;
      }
      else{
        //return "Hubo un error!";
      }

    })

  

  }



}
