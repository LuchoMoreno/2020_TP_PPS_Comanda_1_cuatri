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
  miFormularioAnonimo : FormGroup;

  /*nombre : string;
  apellido : string;
  dni : string;
  foto : string = "../../../assets/icon/iconLogoMovimiento.png";
  */
  usuarioJson = {
    nombre : "",
    apellido : "",
    dni : "",
    foto :  "../../../assets/icon/iconLogoMovimiento.png",
    perfil : "Cliente",
    correo: "",
    contrasenia: "",
    estado : "esperando"
  };

  anonimoJson = {
    nombre : "",
    foto :  "../../../assets/icon/iconLogoMovimiento.png",
    perfil : "Anonimo",
    estado : "esperando"
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
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{3,20}$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{3,20}$')]],
        dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
        contrasenia: ['', [Validators.pattern('^[a-z0-9_-]{6,18}$')]],
        correo: ['', [Validators.required, Validators.email] ],
     });


     this.miFormularioAnonimo = this.formBuilder.group({
      nombreAnonimo: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{3,20}$')]],
   });
   }
   
  ngOnInit() {
  
    this.pickedName = "Cliente";
  }

  pickerUser(pickedName){
    this.listaPerfiles.forEach((usuario) =>{
      if(usuario.perfil == pickedName && pickedName == "Cliente")
      {
        this.usuarioJson.perfil = pickedName;
      }
      else{
        this.anonimoJson.perfil = pickedName;
      }
    })
  }


  registrar()
  {

    if(this.pathImagen != null){   

      this.st.storage.ref(this.pathImagen).getDownloadURL().then((link) =>
      {

        this.usuarioJson.foto = link;

        if (this.pickedName == "Cliente")
        {
          this.bd.crear('usuarios',this.usuarioJson);
        }
        else
        {
          this.bd.crear('usuarios',this.anonimoJson);
        }
        

      });

    }
    else
    {

      if (this.pickedName == "Cliente")
        {
          this.bd.crear('usuarios',this.usuarioJson);
        }
        else
        {
          this.bd.crear('usuarios',this.anonimoJson);
        }
    }

    this.complemetos.presentToastConMensajeYColor("El estado del cliente esta pendiente al registro.","primary");
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
    let auxDni;

    this.barcodeScanner.scan().then(barcodeData => {
      alert('Barcode data: ' + barcodeData);

      auxDni = JSON.parse(barcodeData.text);

      this.usuarioJson.dni = auxDni;

     }).catch(err => {
         console.log('Error', err);
     });

  }

  limpiarCampos()
  {
    this.usuarioJson = {
      nombre : "",
      apellido : "",
      dni : "",
      foto :  "../../../assets/icon/iconLogoMovimiento.png",
      perfil : "Cliente",
      correo: "",
      contrasenia: "",
      estado : "esperando"
    };
  
    this.anonimoJson = {
      nombre : "",
      foto :  "../../../assets/icon/iconLogoMovimiento.png",
      perfil : "Anonimo",
      estado : "esperando"
    }

  }



}
