import { Component, OnInit } from '@angular/core';
// IMPORTO LA CAMARA 
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

// IMPORTO SERVICIO DE BASE DE DATOS
import { DatabaseService } from "../../servicios/database.service";

// IMPORTO FORMBUILDER
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

// IMPORTO FIREBASE
import * as firebase from 'firebase/app';

// IMPORTO FIREBASE STORAGE
import {AngularFireStorage} from "@angular/fire/storage"

// IMPORTO LA CLASE USUARIOS
import { Usuariosbd } from "../../clases/usuariosbd";

// IMPORTO EL SERVICIO COMPLEMENTOS
import { ComplementosService } from 'src/app/servicios/complementos.service';

// BARCODE SCANNER:
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';



@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
})
export class AltaClientePage implements OnInit {

  pickedName : string;
  miFormulario : FormGroup;

  /*nombre : string;
  apellido : string;
  dni : string;
  foto : string = "../../../assets/icon/iconLogoMovimiento.png";
  */
  usuarioJson = {
    nombre : "",
    apellido : "",
    dni : "",
    foto :  "../../../assets/icon/iconLogoMovimiento.png"
  };

  pathImagen : string;

  listaPerfiles = [ 
    { perfil : "Cliente" },
    { perfil : "Anonimo" }
  ]

  constructor(
    private barcodeScanner : BarcodeScanner,
    private camera : Camera,
    private bd : DatabaseService,
    private formBuilder: FormBuilder,
    private st : AngularFireStorage,
    private complemetos : ComplementosService) {
      this.miFormulario = this.formBuilder.group({
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{3,10}$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{3,10}$')]],
        dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
     });
   }
   
  ngOnInit() {
  
    this.pickedName = "Cliente";

  }

  pickerUser(pickedName){
    this.listaPerfiles.forEach((usuario) =>{
      if(usuario.perfil == pickedName )
      {
        
      }
    })
  }

  registrarCliente()
  {
    if(this.pathImagen != null){
      
      this.st.storage.refFromURL("usuarios/").child(this.pathImagen).getDownloadURL().then((link) =>
      {
        this.usuarioJson.foto = link;
      });
   
    }
 
    this.bd.crear('usuarios',this.usuarioJson);


    this.complemetos.presentToastConMensajeYColor("¡El cliente se creo con exito!","primary");
  }

  tomarFotografia()
  {
    const options: CameraOptions =  { 
      quality:100,
      targetHeight:600,
      targetWidth:600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,

    }

    this.camera.getPicture(options).then((imageData)=> {

      var base64Str = 'data:image/jpeg;base64,'+imageData;
      
      //Para que la fotografia se muestre apenas se tomo
      this.usuarioJson.foto = base64Str;

      var storageRef = firebase.storage().ref();
     
      let obtenerMili = new Date().getTime(); 


      var nombreFoto = "usuarios/"+obtenerMili+"."+this.usuarioJson.dni+".jpg";
      var childRef = storageRef.child(nombreFoto);

      this.pathImagen = nombreFoto;

      childRef.putString(base64Str,'data_url').then(function(snapshot)
      {

      })

    },(Err)=>{
      alert(JSON.stringify(Err));
    })
    
  }


  escanearDni()
  {

    let fafafa;

    this.barcodeScanner.scan().then(barcodeData => {
      alert('Barcode data: ' + barcodeData);


      fafafa = JSON.parse(barcodeData.text);

      this.usuarioJson.dni = fafafa;

     }).catch(err => {
         console.log('Error', err);
     });
  

  }




}
