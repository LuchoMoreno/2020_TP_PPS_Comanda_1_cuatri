import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-realizar-pedido',
  templateUrl: './realizar-pedido.page.html',
  styleUrls: ['./realizar-pedido.page.scss'],
})
export class RealizarPedidoPage implements OnInit {

  listaProductos = [];
  cantidadPedido = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
  pickedCant :string;
  jsonDatos:any;

  listaPedido : any;
  jsonPedido = {
    nombreProducto : "",
    cantidad : this.cantidadPedido
  }

  constructor( private firestore : AngularFirestore) { }

  ngOnInit() {

    this.cargarProductos();
    console.log(this.listaPedido);


  }


  
  // PARA LOS CLIENTES Y ANONIMOS -> Cargara un listado completo de los productos
  cargarProductos()
  {
    let fb = this.firestore.collection('productos');
              
    fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
      
      this.listaProductos = [];

      datos.forEach( (dato:any) =>{

     this.listaProductos.push(dato);      // <--- LISTA DE USUARIOS.
        
      });

    })
  }

 

 seleccionCantidad(pickedCant,producto){
    this.listaProductos.forEach((auxProducto) =>{
      if(auxProducto.nombre === producto.nombre)
      {
        this.pickedCant = pickedCant;
       this.jsonDatos.nombre = producto.nombre;
       this.jsonDatos.cantidad = pickedCant;
       console.log(producto);
      return
      }
    })
  
 
  } 

 
}
