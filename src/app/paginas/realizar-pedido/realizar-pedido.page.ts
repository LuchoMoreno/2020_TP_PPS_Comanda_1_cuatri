import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


// IMPORTO SERVICIO DE BASE DE DATOS
import { DatabaseService } from "../../servicios/database.service";


// IMPORTO SERVICIO DE BASE DE DATOS
import { ComplementosService } from "../../servicios/complementos.service";


@Component({
  selector: 'app-realizar-pedido',
  templateUrl: './realizar-pedido.page.html',
  styleUrls: ['./realizar-pedido.page.scss'],
})
export class RealizarPedidoPage implements OnInit {


  pedidoEnFormatoJSON = {
    platosPlato : [],
    platosBebida : [],
    platosPostre : [],
    precioTotal : 0,
    estadoChef : "",
    estadoBartender : "",
    mesa : "",
    estadoPedido : "enEspera"
  };

  cantidadJson ={
    cantHamb : 0,
    cantPizza : 0,
    cantPepsi : 0,
    cantVolc : 0,
    cantLemon : 0,
  }
  listaCantidades = [];

  listaProductosTipoPlato = [];
  listaProductosTipoBebida = [];
  listaProductosTipoPostre = [];


  // IMPORTANTISIMOS
  tipoPlatoPedido : string = null;

  contadorPlatos;
  contadorBebidas;
  contadorPostres;
  contadorVecesQueConfirmaPedido;
  

  // PURA ESTÉTICA:

  variabledesplegarPedido : boolean;


  
  constructor( private firestore : AngularFirestore,
    private bd : DatabaseService,
    private complementos : ComplementosService) { }

  ngOnInit() {

    this.listaProductosTipoPlato = this.cargarProductosTipo("Plato");
    this.listaProductosTipoBebida = this.cargarProductosTipo("Bebida");
    this.listaProductosTipoPostre = this.cargarProductosTipo("Postre");

    this.contadorPlatos = 0;
    this.contadorBebidas = 0;
    this.contadorPostres = 0;
    this.contadorVecesQueConfirmaPedido = 0;

    this.variabledesplegarPedido = false;
    let mesa = localStorage.getItem("mesa");
    this.pedidoEnFormatoJSON.mesa = mesa;
  }


  

  cargarProductosTipo(tipoProducto : string) : any
  {

    var listaProductos = [];
    this.firestore.collection("productos").get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {

        // Correo de la BD == Correo de la lista.
       if(doc.data().tipo == tipoProducto)
       {
        listaProductos.push(doc.data());  
       }

      })
    })

    return listaProductos;
  }


  cargarJSONPedidosPlatos(plato : string, tipoDePlato : string, precio : number)
  {
 
    if (tipoDePlato == "Plato")
    {

      let bandera;
      this.pedidoEnFormatoJSON.platosPlato[this.contadorPlatos] = plato;
      this.contadorPlatos = this.contadorPlatos + 1;
      this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal + precio;
      let cantidad = this.calcularCantidad(plato,'Plato','sumar');
      
      if(plato == 'Hamburguesa')
      {
        this.cantidadJson.cantHamb = cantidad;
      }
      if(plato == 'Pizza')
      {
        this.cantidadJson.cantPizza = cantidad;
      }
   
    }

    if (tipoDePlato == "Bebida")
    {
      this.pedidoEnFormatoJSON.platosBebida[this.contadorBebidas] = plato;
      this.contadorBebidas = this.contadorBebidas + 1;
      this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal + precio;
      let cantidad = this.calcularCantidad(plato,'Bebida','sumar');

        this.cantidadJson.cantPepsi = cantidad;


    }

    if (tipoDePlato == "Postre")
    {
      this.pedidoEnFormatoJSON.platosPostre[this.contadorPostres] = plato;
      this.contadorPostres = this.contadorPostres + 1;
      this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal + precio;
      let cantidad = this.calcularCantidad(plato,'Postre','sumar');
      
      if(plato == 'Pastel de limón')
      {
        this.cantidadJson.cantLemon = cantidad;
      }
      if(plato == 'Volcan de chocolate')
      {
        this.cantidadJson.cantVolc = cantidad;
      }

      
    }


    console.log(this.pedidoEnFormatoJSON);
    

  }



  // ACA ES PURO ESTÉTICA, SOLO PARA CONFIRMAR EL PEDIDO.


  // PARA EL CLIENTE Y ANONIMO -> Abrira una mini pestaña para mostrar si se envia o no
  desplegarPedido()
  {
    this.variabledesplegarPedido = true;
  }

  desplegarInversoPedido()
  {
    this.variabledesplegarPedido = false;
  }


  confirmarPedido()
  {

    if (this.contadorVecesQueConfirmaPedido == 0 && this.pedidoEnFormatoJSON.precioTotal > 0)
    {
      this.complementos.presentToastConMensajeYColor("Pedido generado con éxito. Será redirigido al menú!", "success")
      this.bd.crear('pedidos',this.pedidoEnFormatoJSON);
      this.contadorVecesQueConfirmaPedido = 1;
    }

    else if(this.contadorVecesQueConfirmaPedido == 0 && this.pedidoEnFormatoJSON.precioTotal == 0)
    {
      this.complementos.presentToastConMensajeYColor("¡Debe cargar productos!", "warning")
    }
    
    else
    {
      this.complementos.presentToastConMensajeYColor("¡Su orden ya fue cargada!", "warning")
    }

   
  }
  
  cancelarPedido()
  {
    if (this.contadorVecesQueConfirmaPedido == 0)
    {
      this.pedidoEnFormatoJSON.platosPlato = [];
      this.pedidoEnFormatoJSON.platosBebida = [];
      this.pedidoEnFormatoJSON.platosPostre = [];
      this.pedidoEnFormatoJSON.precioTotal = 0;


      this.contadorPlatos = 0;
      this.contadorBebidas = 0;
      this.contadorPostres = 0;

      this.complementos.presentToastConMensajeYColor("¡El pedido fue cancelado!", "success")
    }
    else
    {
      this.complementos.presentToastConMensajeYColor("¡No puede cancelar un pedido ya enviado!", "warning")
    }
    
  }


  // CON ESTO AGREGO A UNA COLECCIÓN.

  removerJSONPedidosPlatos(plato : string, tipoDePlato : string, precio : number)
  {
   
    if (tipoDePlato == "Plato")
    {

      let auxIndice = this.pedidoEnFormatoJSON.platosPlato.indexOf(plato);

      if(auxIndice >= 0 ){
        let retorno = this.pedidoEnFormatoJSON.platosPlato.splice(auxIndice,1);

          if(this.pedidoEnFormatoJSON.precioTotal > 0 && retorno.length > 0)
          {
            this.contadorPlatos = this.contadorPlatos - 1;
            this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal - precio;
            let cantidad = this.calcularCantidad(plato,'Plato','restar');
      
            if(plato == 'Hamburguesa')
            {
              this.cantidadJson.cantHamb = cantidad;
            }
            if(plato == 'Pizza')
            {
              this.cantidadJson.cantPizza = cantidad;
            }
            
            
          }
      }
    }

    if (tipoDePlato == "Bebida")
    {

      let auxIndice = this.pedidoEnFormatoJSON.platosBebida.indexOf(plato);

      if(auxIndice >= 0 ){
        let retorno = this.pedidoEnFormatoJSON.platosBebida.splice(auxIndice,1);

          if(this.pedidoEnFormatoJSON.precioTotal > 0 && retorno.length > 0)
          {
            this.contadorBebidas = this.contadorBebidas - 1;
            this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal - precio;
            let cantidad = this.calcularCantidad(plato,'Bebida','restar');
      
              this.cantidadJson.cantPepsi = cantidad;

      
          }
      }


    }

    if (tipoDePlato == "Postre")
    {
      let auxIndice = this.pedidoEnFormatoJSON.platosPostre.indexOf(plato);

      if(auxIndice >= 0 ){
        let retorno = this.pedidoEnFormatoJSON.platosPostre.splice(auxIndice,1);

          if(this.pedidoEnFormatoJSON.precioTotal > 0 && retorno.length > 0)
          {
            this.contadorPostres = this.contadorPostres - 1;
            this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal - precio;
            let cantidad = this.calcularCantidad(plato,'Postre','restar');
      
            if(plato == 'Pastel de limón')
            {
              this.cantidadJson.cantLemon = cantidad;
            }
            if(plato == 'Volcan de chocolate')
            {
              this.cantidadJson.cantVolc = cantidad;
            }
          }
      }
     
    }


   console.log(this.pedidoEnFormatoJSON);


  }

  calcularCantidad(nombrePlato : string, tipo : string,funcionalidad : string)
  {
    let contador = 0 ;
    if(funcionalidad == 'sumar')
    {
      if (tipo == 'Plato')
      {
        this.pedidoEnFormatoJSON.platosPlato.forEach( (dato : any) => {
          if(nombrePlato == dato)
          {
            contador ++;
          }
    
        })
      }
      else if(tipo == 'Postre')
      {
        this.pedidoEnFormatoJSON.platosPostre.forEach( (dato : any) => {
          if(nombrePlato == dato)
          {
            contador ++;
          }
    
        })
      }
      else
      {
        this.pedidoEnFormatoJSON.platosBebida.forEach( (dato : any) => {
          if(nombrePlato == dato)
          {
            contador ++;
          }
    
        })
      }
    }
    else
    {
      if (tipo == 'Plato')
      {
        this.pedidoEnFormatoJSON.platosPlato.forEach( (dato : any) => {
          if(nombrePlato == dato)
          {
            contador --;
          }
    
        })
      }
      else if(tipo == 'Postre')
      {
        this.pedidoEnFormatoJSON.platosPostre.forEach( (dato : any) => {
          if(nombrePlato == dato)
          {
            contador --;
          }
    
        })
      }
      else
      {
        this.pedidoEnFormatoJSON.platosBebida.forEach( (dato : any) => {
          if(nombrePlato == dato)
          {
            contador --;
          }
    
        })
      }
    }
   
  

    return contador;
  }

}
