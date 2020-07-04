import { Component, OnInit } from '@angular/core';

// IMPORTO LA CLASE USUARIO.
import { Usuario } from "../../clases/usuario";

// IMPORTO EL TIMER:
import { timer } from 'rxjs';

// SERVICIO DE COMPLEMENTOS.
import {ComplementosService} from "../../servicios/complementos.service"

// IMPORTO EL SERVICIO DE AUTH.
import { AuthService } from "../../servicios/auth.service";


// IMPORTO EL ROUTER COMO ULTIMO PASO.
import { Router } from "@angular/router";

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  //splash = false;

  email : string;
   password : string;

   listaUsuarios = [
    {id:1, correo:"duenio@duenio.com", clave:"111111", perfil:"Dueño"},
    {id:2, correo:"supervisor@supervisor.com", clave:"222222", perfil:"Supervisor"},
    {id:3, correo:"mozo@mozo.com", clave:"333333", perfil:"Mozo"},
    {id:4, correo:"cocinero@cocinero.com", clave:"444444", perfil:"Cocinero"},
    {id:5, correo:"metre@metre.com", clave:"555555", perfil:"Metre"},
    {id:6, correo:"bartender@bartender.com", clave:"666666", perfil:"BarTender"}
   ]


  constructor(
  private authService : AuthService,
  private complementos : ComplementosService,  
  public router : Router, 

  ) { }

  ngOnInit() {
    //localStorage.setItem('tieneCorreo','sinCorreo'); // Cuando iniciamos no tiene correo
    localStorage.removeItem('tieneCorreo');
    localStorage.removeItem('correoUsuario');
  }



// Con el boton, esto hace que directamente se verifique el usuario existe. Si lo hace, entra a home. Sino, da error.
public onSubmitLogin()
{

  this.authService.login(this.email, this.password)
  
  .then((res:any) => { 

    //this.splash = true;
    //this.complementos.presentLoading();

    /*
    setTimeout(() => {
      this.splash = false;
    }, 4000);*/

    let audio = new Audio();
    audio.src = 'assets/audio/login/sonidoBotonSUCESS.mp3';
    audio.play();
    
    timer(1000).subscribe(() => {this.router.navigate(['/home']);
    localStorage.setItem('correoUsuario',res); // Guardamos el correo de la persona que ingreso
    localStorage.setItem('tieneCorreo','conCorreo'); // Verificamos si se ingreso con correo (por el anonimo)
    this.onClearAll();
  });

  }).catch(err => this.complementos.ngValidarError(err.code));
}


// Boton para limpiar.
public onClearAll()
{
  this.email = null;
  this.password = null;

  // let audio = new Audio();
  // audio.src = 'assets/audio/login/sonidoBotonBORRAR.mp3';
  // audio.play();
}


// Selector de usuarios.

pickerUser(pickedName){
  this.listaUsuarios.forEach((user) =>{
    if(user.correo === pickedName)
    {
      this.email=user.correo;
      this.password=user.clave;
      //localStorage.setItem("usuario",JSON.stringify(user));
      return;
    }
  })
}

// Redirecciono a la pagina alta-cliente para registrar el cliente
registrarUsuario()
{
  this.router.navigate(['/alta-cliente']);
}


}
