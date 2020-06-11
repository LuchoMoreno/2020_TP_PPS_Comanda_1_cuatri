import { Injectable } from '@angular/core';
import {AngularFirestore,AngularFirestoreCollection } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) { }

 //Crea un nuevo dato   
 public crear(collection: string, data: any) 
 {    
    return this.firestore.collection(collection).add(data);   
  }

  public obtenerPorId(coleccion:string,id:string)
  {
    return this.firestore.collection(coleccion).doc(id).snapshotChanges();
    // El documento que tenga ese id tal cual este ahora, le saca una foto y me lo devuelve
  }

  public obtenerTodos(coleccion:string)
  {
    return this.firestore.collection(coleccion).snapshotChanges();
  }

  public actualizar(coleccion:string, data:any,id:string)
  {
    return this.firestore.collection(coleccion).doc(id).set(data);
  }

  // Creo una funcion que me obtiene el perfil del usuario, buscando en la base de datos el correo 
  public obtenerUsuariosBD(coleccion:string, email:string)
  {
    let auxPerfil : string;
    let auxPerfilDos : string = "";

    this.firestore.collection(coleccion).get().subscribe((querySnapShot) => {

      querySnapShot.forEach(datos => {

        if(datos.data().correo == email )
        {
          auxPerfil = datos.data().perfil;
          console.log(auxPerfil);
          return auxPerfil;
        }
      })

    })

  }

  

/*
  async getToken(){

    let token;

    if ( this.platform.is('android')) {
      
      token = await this.firebaseNative.getToken()
      
    }

    if (this.platform.is('ios')) {

      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();

    }

    if(!this.platform.is('cordova')) {


    }

    return this.saveTokenToFirestore(token);

  }
  

  private saveTokenToFirestore(token){

    if(!token) return;

    const devicesRef = this.afs.collection('devices')

    const docData = {

      token,
      userId: 'testUser',

    }

    return devicesRef.doc(token).set(docData)

  }


  listenToNotifications() {

    return this.firebaseNative.onNotificationOpen()
  }

*/



}
