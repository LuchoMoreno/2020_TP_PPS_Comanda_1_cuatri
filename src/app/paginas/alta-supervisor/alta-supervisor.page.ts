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
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
})

export class AltaSupervisorPage implements OnInit {

  qrScan:any;

  pickedName : string;
  miFormulario : FormGroup;
  pathImagen : string;

  usuarioJson = {
    nombre : "",
    apellido : "",
    dni : "",
    foto :  "../../../assets/icon/iconLogoMovimiento.png",
    cuil : "",
    perfil : "",
  };

  listaPerfiles = [ 
    { perfil : "Supervisor" },
    { perfil : "Dueño" }
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
        cuil :  ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
     });
   }
   


  ngOnInit() {
  }

  registrarCliente()
  {
    if(this.pathImagen != null){
      

      this.st.storage.ref(this.pathImagen).getDownloadURL().then((link) =>
      {

        this.usuarioJson.foto = link;
        this.bd.crear('usuarios',this.usuarioJson);

      });


    }
    else
    {
      this.bd.crear('usuarios',this.usuarioJson);
    }

   
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

  pickerUser(pickedName){
    this.listaPerfiles.forEach((usuario) =>{
      if(usuario.perfil == pickedName )
      {
        this.usuarioJson.perfil = pickedName;
      }
    })
  }

  escanearDni()
  {

    let auxDni;

    this.barcodeScanner.scan().then(barcodeData => {

      auxDni = JSON.parse(barcodeData.text);

      this.usuarioJson.dni = auxDni;

     }).catch(err => {
         console.log('Error', err);
     });
  

  }


}
