export class Usuariosbd {

    nombre : string;
    apellido : string;
    dni : string;
    cuil : string;
    foto : string;
    perfil : string;

    contructor(nombre : string, apellido : string, dni : string, foto : string , perfil : string, cuil? : string)
    {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.foto = foto;
        this.perfil = perfil;
        if(cuil != null)
        {
            this.cuil = cuil;
        }
        else{
            this.cuil = null;
        }
    }

}
