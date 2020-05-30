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

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  email : string;
   password : string;

   listaUsuarios = [
    {id:1, correo:"duenio@duenio.com", clave:"111111", perfil:"duenio"},
    {id:2, correo:"supervisor@supervisor.com", clave:"222222", perfil:"supervisor"},
    {id:3, correo:"mozo@mozo.com", clave:"333333", perfil:"mozo"},
    {id:4, correo:"cocinero@cocinero.com", clave:"444444", perfil:"cocinero"},
    {id:5, correo:"metre@metre.com", clave:"555555", perfil:"metre"},
    {id:6, correo:"anonimo@anonimo.com", clave:"666666", perfil:"anonimo"}
   ]

 /* email : string;
  password : string;


  users: Usuario[] = [{ id: 1, email: "admin@admin.com", password: "111111", perfil: "admin", sexo: "femenino" },
  { id: 2, email: "invitado@invitado.com", password: "222222", perfil: "invitado", sexo: "femenino" },
  { id: 3, email: "usuario@usuario.com", password: "333333", perfil: "usuario", sexo: "masculino" },
  { id: 4, email: "anonimo@anonimo.com", password: "444444", perfil: "anonimo", sexo: "masculino" },
  { id: 5, email: "tester@tester.com", password: "555555", perfil: "tester", sexo: "femenino" }]
  */

  constructor(
  private authService : AuthService,
  private complementos : ComplementosService,  
  public router : Router, 

  ) { }

  ngOnInit() {
  }



// Con el boton, esto hace que directamente se verifique el usuario existe. Si lo hace, entra a home. Sino, da error.
public onSubmitLogin()
{

  this.authService.login(this.email, this.password)
  
  .then(res => { 

    this.complementos.presentLoading();

    let audio = new Audio();
    audio.src = 'assets/audio/login/sonidoBotonSUCESS.mp3';
    audio.play();

    timer(2000).subscribe(() => {this.router.navigate(['/home']);
  });

  }).catch(err => this.complementos.ngValidarError(err.code));
}


// Boton para limpiar.
public onClearAll()
{
  this.email = null;
  this.password = null;

  let audio = new Audio();
  audio.src = 'assets/audio/login/sonidoBotonBORRAR.mp3';
  audio.play();
}


// Selector de usuarios.

/*pickUser(pickedName) {
  this.users.forEach((user) => {
    if (user.perfil === pickedName) {
      this.email = user.email;
      this.password = user.password;
      return;
    }
  });
}
*/
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
