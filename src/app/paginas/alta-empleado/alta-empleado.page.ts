import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DatabaseService } from 'src/app/servicios/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import {AngularFireStorage} from "@angular/fire/storage"
import { ComplementosService } from 'src/app/servicios/complementos.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.page.html',
  styleUrls: ['./alta-empleado.page.scss'],
})
export class AltaEmpleadoPage implements OnInit {

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
    contrasenia: "",
    correo : "",
  };

  listaPerfiles = [ 
    { perfil : "Mozo" },
    { perfil : "Cocinero" },
    { perfil : "Bar tender" },
    { perfil : "Metre" }
  ]

  constructor(
    private barcodeScanner : BarcodeScanner,
    private camera : Camera,
    private bd : DatabaseService,
    private formBuilder: FormBuilder,
    private auth : AuthService,
    private st : AngularFireStorage,
    private complemetos : ComplementosService) {
      
      this.miFormulario = this.formBuilder.group({
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{3,10}$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{3,10}$')]],
        dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
        cuil :  ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
        contrasenia: ['', [Validators.required] ],
        correo: ['', [Validators.required, Validators.email] ],
     });
   }
   


  ngOnInit() {

  this.pickedName = "Mozo";
  this.usuarioJson.perfil = this.pickedName;

  }

  registrar(perfil)
  {
    if(this.pathImagen != null){
      

      this.st.storage.ref(this.pathImagen).getDownloadURL().then((link) =>
      {

        this.usuarioJson.foto = link;
        this.bd.crear('empleados',this.usuarioJson);

      });

    }
    else
    {
      this.bd.crear('empleados',this.usuarioJson);
    }

   this.auth.registrarUsuario(this.usuarioJson.correo,this.usuarioJson.contrasenia);
    this.complemetos.presentToastConMensajeYColor("¡El "+perfil +" se creo con exito!","primary");
    this.limpiarCampos();
  }

  limpiarCampos()
  {
    this.usuarioJson.nombre = "";
    this.usuarioJson.apellido = ""; 
    this.usuarioJson.dni = "";  
    this.usuarioJson.foto = "../../../assets/icon/iconLogoMovimiento.png",
    this.usuarioJson.cuil = "";  
    this.usuarioJson.perfil = this.pickedName;  
    this.usuarioJson.contrasenia = "";  
    this.usuarioJson.correo = ""; 

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

      var nombreFoto = "empleados/"+obtenerMili+"."+this.usuarioJson.dni+".jpg";

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
