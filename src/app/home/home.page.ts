import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  // IMAGENES POR DEFECTO EN LOS REDONDITOS.
  srcDefaultPaises = "assets/home/banderas/banderas_default.png"; 
  srcDefaultTemas = 'assets/home/temas/tema_default.png';

  // VALORES POR DEFECTO.
  mostrar = 'colores';
  idioma = 'español';
  acentoIdioma = 'español';


  constructor() {}


// CAMBIO LA FOTITO DEL REDONDO EN EL IDIOMA.
  cambiarIdioma( idioma: string) {
    let audio = new Audio();
    audio.src = 'assets/audio/home/cambiarRedondo.mp3';
    audio.load();
    audio.play();
    
    this.idioma = idioma;
    if (idioma === 'ingles') {
      this.acentoIdioma = 'inglés';
      this.srcDefaultPaises = 'assets/home/banderas/bandera_inglaterra.png';
    } 
    else if (this.idioma === 'portugues') {
      this.acentoIdioma = 'portugués';
      this.srcDefaultPaises = 'assets/home/banderas/bandera_brasil.png';
    } 
    else {
      this.acentoIdioma = 'español';
      this.srcDefaultPaises = 'assets/home/banderas/bandera_españa.png';
    }
  }

// CAMBIO LA FOTITO DEL REDONDO EN EL TEMA. 
  cambiarTema( tema: string) {


    this.mostrar = tema;

    let audio = new Audio();
    audio.src = 'assets/audio/home/cambiarRedondo.mp3';
    audio.load();
    audio.play();

    if (tema  === 'colores') {
      this.srcDefaultTemas = 'assets/home/temas/tema_colores.png';
    } else if ( tema === 'numeros') {
      this.srcDefaultTemas = 'assets/home/temas/tema_numeros.png';
    } else {
      this.srcDefaultTemas = 'assets/home/temas/tema_animales.png';
    }
  }


// ESTA FUNCION LO QUE HACE ES REPRODUCIR TEMAS. 
  reproducir(tema: string, valor: string) {

    let audio = new Audio();
    let path: string;

    path = this.traducirTemas(tema, valor);

    audio.src = `assets/audio/${path}`;

    audio.load();
    audio.play();
  }


  // ESTA FUNCION LO QUE HACE ES REPRODUCIR UN TEMA ESPECIFICO.
  traducirTemas(tema: string , valor: string) {

  let retorno: string;

    if (tema === 'colores') {
      retorno = this.traducirColor(valor);

    } else if (tema === 'numeros') {
      retorno = this.traducirNumero(valor);

    } else {
      retorno = this.traducirAnimales(valor);
    }

    return retorno;
  }



// ESTA FUNCION TRADUCE LOS NUMEROS. 
  traducirNumero(valor: string) {
    if (this.idioma === 'español') {
      switch (valor) {
        case '1':
          return 'numeros/esp_uno.mp3';
        case '2':
          return 'numeros/esp_dos.mp3';
        case '3':
          return 'numeros/esp_tres.mp3';
        case '4':
          return 'numeros/esp_cuatro.mp3';
        case '5':
          return 'numeros/esp_cinco.mp3';
        default:
          break;
      }

    } else if (this.idioma === 'ingles') {
      switch (valor) {
        case '1':
          return 'numeros/in_uno.mp3';
        case '2':
          return 'numeros/in_dos.mp3';
        case '3':
          return 'numeros/in_tres.mp3';
        case '4':
          return 'numeros/in_cuatro.mp3';
        case '5':
          return 'numeros/in_cinco.mp3';
        default:
          break;
      }

    } else {
      switch (valor) {
        case '1':
          return 'numeros/por_uno.mp3';
        case '2':
          return 'numeros/por_dos.mp3';
        case '3':
          return 'numeros/por_tres.mp3';
        case '4':
          return 'numeros/por_cuatro.mp3';
        case '5':
          return 'numeros/por_cinco.mp3';
        default:
          break;
      }}}

    

  // ESTA FUNCION TRADUCE LOS COLORES. 
  traducirColor(valor: string) {
    if (this.idioma === 'español') {
      switch (valor) {
        case 'rojo':
          return 'colores/esp_rojo.mp3';
        case 'azul':
          return 'colores/esp_azul.mp3';
        case 'amarillo':
          return 'colores/esp_amarillo.mp3';
        case 'verde':
          return 'colores/esp_verde.mp3';
        case 'naranja':
          return 'colores/esp_naranja.mp3';
        default:
          break;
      }
    } else if (this.idioma === 'ingles') {
      switch (valor) {
        case 'rojo':
          return 'colores/in_rojo.mp3';
        case 'azul':
          return 'colores/in_azul.mp3';
        case 'amarillo':
          return 'colores/in_amarillo.mp3';
        case 'verde':
          return 'colores/in_verde.mp3';
        case 'naranja':
          return 'colores/in_naranja.mp3';
        default:
          break;
      }
    } else {
      switch (valor) {
        case 'rojo':
          return 'colores/por_rojo.mp3';
        case 'azul':
          return 'colores/por_azul.mp3';
        case 'amarillo':
          return 'colores/por_amarillo.mp3';
        case 'verde':
          return 'colores/por_verde.mp3';
        case 'naranja':
          return 'colores/por_naranja.mp3';
        default:
          break;
      }}}



  // ESTA FUNCION TRADUCE LOS ANIMALES. 
  traducirAnimales(valor: string) {
    if (this.idioma === 'español') {
      switch (valor) {
        case 'ballena':
          return 'animales/esp_ballena.mp3';
        case 'buho':
          return 'animales/esp_buho.mp3';
        case 'cerdo':
          return 'animales/esp_cerdo.mp3';
        case 'vaca':
          return 'animales/esp_vaca.mp3';
        case 'zorro':
          return 'animales/esp_zorro.mp3';
        default:
          break;
      }
    } else if (this.idioma === 'ingles') {
      switch (valor) {
        case 'ballena':
          return 'animales/in_ballena.mp3';
        case 'buho':
          return 'animales/in_buho.mp3';
        case 'cerdo':
          return 'animales/in_cerdo.mp3';
        case 'vaca':
          return 'animales/in_vaca.mp3';
        case 'zorro':
          return 'animales/in_zorro.mp3';
        default:
          break;
      }
    } else {
      switch (valor) {
        case 'ballena':
          return 'animales/por_ballena.mp3';
        case 'buho':
          return 'animales/por_buho.mp3';
        case 'cerdo':
          return 'animales/por_cerdo.mp3';
        case 'vaca':
          return 'animales/por_vaca.mp3';
        case 'zorro':
          return 'animales/por_zorro.mp3';
        default:
          break;
      }}}

  // 
  
}
