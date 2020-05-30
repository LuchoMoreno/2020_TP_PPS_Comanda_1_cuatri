import { Component, OnInit, Input } from '@angular/core';
import { ComplementosService } from 'src/app/servicios/complementos.service';


import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


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
  

  constructor(public barcodeScanner : BarcodeScanner) {}


  ngOnInit() {
  }


  escanearDni()
  {

    let fafafa;

    this.barcodeScanner.scan().then(barcodeData => {
      alert('Barcode data: ' + barcodeData);


      fafafa = JSON.parse(barcodeData.text);

      this.dni = fafafa;

     }).catch(err => {
         console.log('Error', err);
     });
  

  }



}
