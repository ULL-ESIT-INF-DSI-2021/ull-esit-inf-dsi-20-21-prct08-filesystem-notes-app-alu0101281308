![Logo](img/logo.png)

#### Ingeniería Informática
#### Desarrollo de sistemas informáticos
#### Elvis Nogueiras alu0101281308@ull.edu.es

# Práctica 8 - Aplicación de procesamiento de notas de texto

## Introducción
En esta práctica, tendrá que implementar una aplicación de procesamiento de notas de texto. En concreto, la misma permitirá añadir, modificar, eliminar, listar y leer notas de un usuario concreto. Las notas se almacenarán como ficheros JSON en el sistema de ficheros de la máquina que ejecute la aplicación. Además, solo se podrá interactuar con la aplicación desde la línea de comandos.

## Objetivos
Los objetivos que deben cumplir para la aplicación de procesamiento de notas de texto son los siguientes:

* La aplicación de notas deberá permitir que múltiples usuarios interactúen con ella, pero no simultáneamente.

* Una nota estará formada, como mínimo, por un título, un cuerpo y un color (rojo, verde, azul o amarillo).

* Cada usuario tendrá su propia lista de notas, con la que podrá llevar a cabo las siguientes operaciones:

* Añadir una nota a la lista. Antes de añadir una nota a la lista se debe comprobar si ya existe una nota con el mismo título. En caso de que así fuera, deberá mostrarse un mensaje de error por la consola. En caso contrario, se añadirá la nueva nota a la lista y se mostrará un mensaje informativo por la consola.

* Modificar una nota de la lista. Antes de modificar una nota, previamente se debe comprobar que exista una nota con el título de la nota a modificar en la lista. Si existe, se procede a su modificación y se emite un mensaje informativo por la consola. En caso contrario, debe mostrarse un mensaje de error por la consola.

* Eliminar una nota de la lista. Antes de eliminar una nota, previamente se debe comprobar que exista una nota con el título de la nota a eliminar en la lista. Si existe, se procede a su eliminación y se emite un mensaje informativo por la consola. En caso contrario, debe mostrarse un mensaje de error por la consola.

* Listar los títulos de las notas de la lista. Los títulos de las notas deben mostrarse por la consola con el color correspondiente de cada una de ellas. Use el paquete chalk para ello.

* Leer una nota concreta de la lista. Antes de mostrar el título y el cuerpo de la nota que se quiere leer, se debe comprobar que en la lista existe una nota cuyo título sea el de la nota a leer. Si existe, se mostrará el título y cuerpo de la nota por la consola con el color correspondiente de la nota. Para ello, use el paquete chalk. En caso contrario, se mostrará un mensaje de error por la consola.

* Todos los mensajes informativos se mostrarán con color verde, mientras que los mensajes de error se mostrarán con color rojo. Use el paquete chalk para ello.

* Hacer persistente la lista de notas de cada usuario. Aquí es donde entra en juego el uso de la API síncrona de Node.js para trabajar con el sistema de ficheros:

  * Guardar cada nota de la lista a un fichero con formato JSON. Los ficheros JSON correspondientes a las notas de un usuario concreto deberán almacenarse en un directorio con el nombre de dicho usuario.

  * Cargar una nota desde los diferentes ficheros con formato JSON almacenados en el directorio del usuario correspondiente.

* Un usuario solo puede interactuar con la aplicación de procesamiento de notas de texto a través de la línea de comandos. Los diferentes comandos, opciones de los mismos, así como manejadores asociados a cada uno de ellos deben gestionarse mediante el uso del paquete yargs.
 
 ## Solución de diseño para el proyecto de notas.

 Para cumplir los requisitos de esta practica cree un diseño que consta de 3 clases :
 * `FileManager` : Es una clase cuyo patron de diseño es creacional del tipo singleton, esta se encarga de el manejo de los ficheros con el uso del sistema de ficheros `fs` de typescript; sus metodos tienen como funcion la creacion de carpetas con los nombres de los usuarios, la creacion de notas en formato json, la eliminacion de ficheros, etc..

 * `Usuario` : La clase usuario tiene el proposito de crear a los usuarios del sistema a los que se les va a asociar las notas, para crear un usuario solo se debe proporcionar un nombre.

 * `Nota` : La clase Nota al igual que la clase Usuario, tiene un proposito simple, en este caso es el de crear objetos de tipo Nota cuyos atributos son el titulo, el contenido o cuerpo y un color que se usara para indentificar la nota de forma visual.

 El funcionamiento del programa consiste en programar en los diferentes comandos que se piden haciendo uso del yarg y asi obtener los argumentos introducidos por linea de comando.
 Con estos argumentos se crean objetos del tipo `Nota` y `Usuario` y con la instancia del `FileManager` verifico con sus metodos los requisitos que se piden para cada objetivo del comando en el que se este trabajando.

 ## Clases

 ### Usuario
 ~~~ ts
/**
 * Clase que gestiona todo lo relacionado a usuarios.
 */
export class Usuario {
    constructor(private readonly nombre:string) {
    }

    getName() : string {
        return this.nombre;
    }

}
 ~~~

 ### Nota
 ~~~ ts
 /**
 * Enumerable que posee los colores permitidos para el uso de las notas.
 */
export enum Color {rojo = "red", verde = "green", azul = "blue", amarillo = "yellow"}

/**
 * Clase que gestiona la creacion de notas, con sus respectivos geters y seters para cada 
 * atributo.
 */
export class Nota {
    /**
     * 
     * @param titulo Titulo que tendra la nota. 
     * @param cuerpo Contenido de la nota.
     * @param color Color para la nota.
     */
    constructor(private titulo:string, private cuerpo: string, private color: Color) {
    }


    setTitutlo(titulo: string){
        this.titulo = titulo;
    }

    getTitulo() : string {
        return this.titulo;
    }

    setCuerpo(cuerpo: string){
        this.cuerpo = cuerpo;
    }

    getCuerpo() : string {
        return this.cuerpo
    }

    setColor(color: Color){
        this.color = color;
    }

    getColor() : string {
        return this.color;
    }

}
 ~~~

 ### FileManager
 ~~~ ts
 import chalk = require("chalk");
import * as fs from "fs";
import { Nota } from "./Notas";
import { Usuario } from "./Usuario";

/**
 * Clase que administra todo lo relacionado al manejo de ficheros,
 * cumple con el patron de diseño creacional SINGLETON.
 */
export class FileManager {
    private pathbd : string;
    private static instance: FileManager;

    /**
     * El constructor define la direccion raiz en donde se guardaran las notas de los usuarios.
     */
    private constructor() {
        this.pathbd = "./notas/";
        fs.mkdirSync(this.pathbd, {recursive: true})
    }

    /**
     * Metodo estatico para cumplir con el patron singleton, este devuelve la unica instancia del objeto.
     * @returns instancia del objeto FileManager.
     */
    public static getFileManagerInstance(): FileManager {
      if (!FileManager.instance) {
        FileManager.instance = new FileManager();
      }
      return FileManager.instance;
    }

    /**
     * Metodo que verifica si hay un fichero que coincida con el nombre del usuario dado.
     * @param usuario usuario a verificar.
     * @returns verdadero si existe el fichero, falso si no existe.
     */
    userFileExist(usuario: Usuario): boolean {
        if(fs.existsSync(this.pathbd + usuario.getName())) {
            return  true;
        } else {
            return false; 
        }
    }

    /**
     * Metodo que verifica si el usuario dado posee una nota con el titulo dado.
     * @param usuario Usuario a verificar.
     * @param titulo Titulo de la nota a verificar.
     * @returns verdadero si existe la nota, falso si no existe.
     */
    userFileNoteJsonExist(usuario: Usuario, titulo: string): boolean {
        const nota_titulo = titulo.split(' ').join('')
        if(fs.existsSync(this.pathbd + usuario.getName() + `/${nota_titulo}.json`)) {
            return true;
        } else {
            return false;
        }   
    }
    
    /**
     * Metodo que crea una nota en formato .json dentro del fichero del usuario.
     * @param usuario Usuario al que se le agregara la nota.
     * @param nota Nota a agregar.
     */
    createFileNoteJson(usuario: Usuario, nota: Nota) {
        const nota_titulo = nota.getTitulo().split(' ').join('')
        const json = `{ "title": "${nota.getTitulo()}", "body": "${nota.getCuerpo()}" , "color": "${nota.getColor()}" }`
        fs.writeFileSync(this.pathbd+usuario.getName()+`/${nota_titulo}.json`, json);
    }

    /**
     * Metodo para crear un fichero con el nombre del usuario dado.
     * @param usuario Usuario para crear el fichero.
     */
    createUserFolder(usuario: Usuario) {
        fs.mkdirSync(this.pathbd + usuario.getName(), {recursive: true})
    }

    /**
     * Metodo que obtiene un arreglo de Notas de un usuario.
     * @param usuario Usuario a buscar.
     * @returns Arreglo de notas del usuario.
     */
    listUserNoteJsonFiles(usuario: Usuario) : Nota[]{
        let result : Nota[] = [];
        fs.readdirSync(this.pathbd+`/${usuario.getName()}/`).forEach((notas) => {
            const data = fs.readFileSync(this.pathbd+`/${usuario.getName()}/${notas}`);
            const nota_json = JSON.parse(data.toString());
            const nota : Nota = new Nota(nota_json.title, nota_json.body, nota_json.color);
            result.push(nota);
          });
          return result;
    }

    /**
     * Metodo que convierte una nota en formato json a un objeto de tipo Nota.
     * @param usuario Usuario que posee la nota.
     * @param titulo Titulo de la nota a convertir.
     * @returns Objeto de tipo Nota.
     */
    parseJsonNote(usuario: Usuario, titulo: string) : Nota {
        const nota_titulo = titulo.split(' ').join('');
        const data = fs.readFileSync(this.pathbd+`/${usuario.getName()}/${nota_titulo}.json`);
        const nota_json = JSON.parse(data.toString());
        const nota : Nota = new Nota(nota_json.title, nota_json.body, nota_json.color);
        return nota;  
    }

    /**
     * Metodo que elimina una nota del usuario dado.
     * @param usuario Usuario a eliminar la nota.
     * @param titulo Titutlo de la nota a eliminar.
     */
    removeFile(usuario: Usuario, titulo: string) {
        const nota_titulo = titulo.split(' ').join('');
        fs.rmSync(this.pathbd+`/${usuario.getName()}/${nota_titulo}.json`);
    }

}
 ~~~

 ## Main

 ~~~ ts
 import * as chalk from 'chalk';
import * as yargs from 'yargs';
import {Color, Nota} from "./Notas";
import {Usuario} from "./Usuario";
import { FileManager } from './FileManager';

const fm: FileManager = FileManager.getFileManagerInstance();

yargs.command({
    command: 'add',
    describe: 'Agregar una nota a un usuario.',
    builder: {  
      user: {
        describe: 'Usuario propietario de la nota',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Titulo de la nota',
        demandOption: true,
        type: 'string',
      },
      body: {
        describe: 'Contenido de la nota',
        demandOption: true,
        type: 'string',
      },
      color: {
        describe: 'Color del titulo de la nota -> yellow - green - red - blue.',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if ((typeof argv.user === 'string') && (typeof argv.title === 'string') && (typeof argv.body === 'string') && (typeof argv.color === 'string')) { 
        let color_titulo: Color = Color.azul;
        
        
        Object.values(Color).forEach((color) => {
          if (color === argv.color) {
            color_titulo = color;
          }
        });
    
        const usuario = new Usuario(argv.user);
        const nota = new Nota(argv.title, argv.body, color_titulo)
        
        if(fm.userFileExist(usuario)) {
          if(!fm.userFileNoteJsonExist(usuario, nota.getTitulo())) {
            fm.createFileNoteJson(usuario, nota);
            console.log(chalk.green("New note added!"));
          } else {
            console.log(chalk.red("Note title taken!"))
          }
        }else {
          fm.createUserFolder(usuario);
          fm.createFileNoteJson(usuario, nota);
          console.log(chalk.green("New note added!"));
        }
      }
    },
  });

  yargs.command({
    command: 'list',
    describe: 'Listar las notas del usuario.',
    builder: {  
      user: {
        describe: 'Usuario propietario de la nota',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string') { 
        const usuario: Usuario = new Usuario(argv.user);
        if (fm.userFileExist(usuario)) {
          const notas: Nota[] = fm.listUserNoteJsonFiles(usuario);
          console.log(chalk.cyan("Your Notes"))
          for (let i = 0; i < notas.length; i++) {
            console.log(chalk.keyword(notas[i].getColor())(notas[i].getTitulo()))
          }    
        } else {
          console.log(chalk.red("User not found"));
        }
      }
    },
  });

  yargs.command({
    command: 'read',
    describe: 'Lee la nota del usuario.',
    builder: {  
      user: {
        describe: 'Usuario propietario de la nota',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Titulo de la nota.',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if ((typeof argv.user === 'string') && (typeof argv.title === 'string')) { 
        const usuario = new Usuario(argv.user);
        if(fm.userFileExist(usuario)){
          if (fm.userFileNoteJsonExist(usuario, argv.title)) {
             const nota : Nota = fm.parseJsonNote(usuario, argv.title);
             console.log(chalk.keyword(nota.getColor())(nota.getTitulo()));
             console.log(chalk.keyword(nota.getColor())(nota.getCuerpo()));
          } else {
            console.log(chalk.red("No note found"));
          }
        } else {
          console.log(chalk.red("User not found"));
        }
      }
    },
  });

  yargs.command({
    command: 'remove',
    describe: 'Elimina la nota del usuario.',
    builder: {  
      user: {
        describe: 'Usuario propietario de la nota.',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Titulo de la nota.',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if ((typeof argv.user === 'string') && (typeof argv.title === 'string')) { 
        const usuario = new Usuario(argv.user);
        if(fm.userFileExist(usuario)){
          if (fm.userFileNoteJsonExist(usuario, argv.title)) {
             fm.removeFile(usuario, argv.title);
             console.log(chalk.green("Note removed!"));
          } else {
            console.log(chalk.red("No note found"));
          }
        } else {
          console.log(chalk.red("User not found"));
        }
      }
    },
  });

  yargs.command({
    command: 'modify',
    describe: 'Modifica una nota del usuario ya existente.',
    builder: {  
      user: {
        describe: 'Usuario propietario de la nota',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Titulo de la nota.',
        demandOption: true,
        type: 'string',
      },
      body: {
        describe: 'Contenido de la nota',
        demandOption: true,
        type: 'string',
      },
      color: {
        describe: 'Color del titulo de la nota -> yellow - green - red - blue.',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if ((typeof argv.user === 'string') && (typeof argv.title === 'string') && (typeof argv.body === 'string') && (typeof argv.color === 'string')) { 
        let color_titulo: Color = Color.azul;
        const usuario = new Usuario(argv.user);

        Object.values(Color).forEach((color) => {
          if (color === argv.color) {
            color_titulo = color;
          }
        });

        const nota = new Nota(argv.title, argv.body, color_titulo)
        if(fm.userFileExist(usuario)){
          if (fm.userFileNoteJsonExist(usuario, argv.title)) {
             fm.createFileNoteJson(usuario, nota);
             console.log(chalk.green("Note modified correctly!"));
          } else {
            console.log(chalk.red("No note found"));
          }
        } else {
          console.log(chalk.red("User not found"));
        }
      }
    },
  });

yargs.parse();
 
 ~~~

## Pruebas y resultados
 ~~~ ts
import 'mocha';
import {expect} from 'chai';
import {FileManager} from '../../src/Ejercicio-Notas/FileManager'
import { Usuario } from '../../src/Ejercicio-Notas/Usuario';
import { Nota, Color } from '../../src/Ejercicio-Notas/Notas';



describe('add function tests', () => {

  const fm: FileManager = FileManager.getFileManagerInstance();
  const elvis: Usuario = new Usuario("Elvis"); 
  const nota: Nota = new Nota("spec-test", "esto es una nota de prueba para la spec", Color.rojo);

  it('File Manager comprueba que existe el usuario Elvis', () => {
    expect(fm.userFileExist(elvis)).to.be.equal(true);
  });

  it('File Manager comprueba que existe la nota 1 de Elvis', () => {
    expect(fm.userFileNoteJsonExist(elvis, "nota 1")).to.be.equal(true);
  });

  it('File Manager obtiene la lista de notas de Elvis', () => {
    expect(fm.listUserNoteJsonFiles(elvis).length).to.be.equal(4);
  });

  it('File Manager obtiene la nota 1 de Elvis', () => {
    expect(fm.listUserNoteJsonFiles(elvis)[0]).to.deep.equal({ titulo: 'nota 1', cuerpo: 'Nota de prueba 1', color: 'yellow' });
  });

  it('File Manager crea una nota nueva en el usuario Elvis', () => {
    fm.createFileNoteJson(elvis, nota);
    expect(fm.userFileNoteJsonExist(elvis, nota.getTitulo())).to.be.equal(true);
  });

  it('File Manager convierte nota1.json de elvis a un objeto de tipo Nota', () => {
    expect(fm.parseJsonNote(elvis, nota.getTitulo())).to.deep.equal(nota);
  });

  it('File Manager elimina la nota spec-test del usuario Elvis', () => {
    fm.removeFile(elvis, nota.getTitulo());
    expect(fm.userFileNoteJsonExist(elvis, nota.getTitulo())).to.be.equal(false);
  });


});

 ~~~

 ~~~ 
   add function tests
    ✓ File Manager comprueba que existe el usuario Elvis
    ✓ File Manager comprueba que existe la nota 1 de Elvis
    ✓ File Manager obtiene la lista de notas de Elvis
    ✓ File Manager obtiene la nota 1 de Elvis
    ✓ File Manager crea una nota nueva en el usuario Elvis
    ✓ File Manager convierte nota1.json de elvis a un objeto de tipo Nota
    ✓ File Manager elimina la nota spec-test del usuario Elvis

  add function tests
    ✓ Simulacion de compra del producto con Visa - Patron comportamiento Strategy
    ✓ Simulacion de compra del producto con Mastercard - Patron comportamiento Strategy
    ✓ Simulacion de compra del producto con Paypal - Patron comportamiento Strategy
    ✓ Simulacion de compra del producto con Stripe - Ejemplo de metodo de pago a futuro - Patron comportamiento Strategy


  11 passing (45ms)

----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------------|---------|----------|---------|---------|-------------------
All files             |   90.91 |       75 |   82.14 |   89.66 |                   
 Ejercicio-Notas      |    90.2 |       75 |      80 |   88.89 |                   
  FileManager.ts      |   93.94 |    66.67 |      90 |   93.94 | 42,77             
  Notas.ts            |      80 |      100 |    62.5 |   66.67 | 22,30,38          
  Usuario.ts          |     100 |      100 |     100 |     100 |                   
 Ejercicio-Presencial |   93.33 |      100 |    87.5 |   92.31 |                   
  Mastercard.ts       |     100 |      100 |     100 |     100 |                   
  Paypal.ts           |     100 |      100 |     100 |     100 |                   
  Producto.ts         |   85.71 |      100 |      75 |      80 | 22                
  Stripe.ts           |     100 |      100 |     100 |     100 |                   
  Visa.ts             |     100 |      100 |     100 |     100 |                   
----------------------|---------|----------|---------|---------|-------------------
 ~~~

## Solución de diseño para el ejercicio presencial.

El ejercicio consistia en aplicar un patron de diseño que se adecue mas para la creacion de un programa que simule la compra de productos con diferentes metodos de pago, dependiendo de estos se aplicaria una comision diferente sobre el precio.

Use el patron de comportamiento strategy ya que este permite definir una familia de algoritmos donde cada uno es una clase independiente, estas clases serian los metodos de pago y la clase contexto de la cual se aplica este patron seria 

El patrón de comportamiento Strategy permite definir una familia de algoritmos, cada uno de ellos en una clase independiente, de manera que los diferentes objetos de esas clases sean intercambiables.

Generalmente, el patrón es aplicable cuando se dispone de una clase, denominada contexto, que lleva a cabo una funcionalidad específica de maneras diferentes como, por ejemplo, aplicar diferentes métodos de ordenación a una colección o resolver un problema de optimización mediante diferentes tipos de técnicas algorítmicas:

Strategy propone extraer cada uno de esos algoritmos del contexto para incluirlos en clases independientes denominadas estrategias. En este punto cabe mencionar que todas las estrategias deberán implementar una interfaz común. Luego, la clase contexto deberá almacenar una referencia a una estrategia, la cual recibirá desde el código cliente. También dispondrá de un setter que permitirá cambiar la estrategia aplicada en tiempo de ejecución. Teniendo en cuenta todo lo anterior, el contexto se vuelve independiente de las estrategias, de modo que se pueden añadir nuevas estrategias o modificar las ya existentes sin necesidad de modificar el contexto. Nuestro ejemplo anterior con el patrón Strategy implementado quedaría tal y como sigue:

