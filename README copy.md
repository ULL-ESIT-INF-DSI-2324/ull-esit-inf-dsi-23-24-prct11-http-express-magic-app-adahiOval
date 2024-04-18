[![Tests](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-adahiOval/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-adahiOval/actions/workflows/node.js.yml)

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-adahiOval/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-adahiOval?branch=main)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-adahiOval&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-adahiOval)

## Introducción

En esta práctica se presenta 1 ejercicio para familiarizarnos con el modulo yargs y el modulo chalk, así como con los principios SOLID y los sockets en node con el patrón request-response y la API asincrona de Node y el patron callback y callback chaining. Para ello se han desarrollado este ejercicio en la carpeta `src` y sus correspondientes pruebas en la carpeta `test`. 

Para la instalación de las dependencias necesarias para hacer funcionar el código solo es necesario el comando:

```bash
npm install
```

## Objetivos

Los objetivos de esta práctica son la familiarización con los modulos yargs y chalk, así como los principios SOLID de 
programación orientada a objetos y también la implementación de coveralls en nuestro código, el patrón request-response 
y los sockets y la programación asincrona con la api asincrona de Node. 

## Clases

Las clases desarrolladas para esta práctica son las siguientes:

 - Card: Clase base de los distintos tipos de cartas, con sus correspondientes atributos
 - CardCollection: Coleccion de cartas.
 - CardCollectionReader: Lector de Coleccion de cartas a partir de un directorio de un usuario
 - CardCollectionPrinter: Printer de una coleccion de cartas dada
 - CardCollectionWriter: Escritor de la coleccion de cartas en el directorio del usuario de la misma
 - CardReader: Lector de carta individual a partir de un objeto JSON
 - EventEmitterServer: Clase cuya funcion principal es un server que tenga manera de asegurarse de que los mensajes 
 llegan completos desde el socket al server.

### Card

Esta es la clase base de los distintos tipos de cartas. Es una clase abstracta cuyo constructor tiene los atributos mínimos compartidos por todas las cartas. De ella se crea una clase diferente para cada tipo de carta:

- Tierra
- Encantamiento
- Conjuro
- Instantaneo
- Artefacto
- Criatura: Con el atributo adicional `stats`
- Planeswalker: Con el atributo adicional `loyalty`

También se define un método abstracto `print()` que cada una de las clases hijas implementa propiamente.

### CardCollection

Esta es la clase que representa una colección de cartas de un usuario dado. Su constructor recibe un array de objetos tipo `Card` y un string con el nombre de usuario. Dentro de esta clase se encuentran los siguientes métodos:

- `addCard`: Este es el método para añadir una carta a la colección, se le pasa una carta por parámetro y la añade al array de cartas de la colección
- `updateCard`: Este método modifica una carta existente, se le pasa una carta y elimina la carta existente con el mismo ID y añade la nueva carta dada por parametro.
- `deleteCard`: Este método elimina una carta de la colección, se le pasa un ID por parámetro que comprueba si existe primero y luego filtra la colección para que devuelva un nuevo array con los IDs que no coinciden.
- `showCard`: Este método muestra la información de una sola carta por consola, se le pasa un ID que busca en la colección e invoca el método print de la carta concreta.
- `listCollection`: Este método lista todas las cartas de la colección, para ello crea un objeto `CardCollectionPrinter` que toma la propia coleccion, y luego invoca a su método print que a su vez invoca el metodo print de todas las cartas de la colección.

### CardCollectionReader

Esta clase se encarga de leer las cartas del directorio de un usuario dado. Para ello, se le pasa el nombre de usuario en el constructor, que se encarga de crear la ruta relativa al directorio del usuario utilizando el módulo `path` de la siguiente manera:

```typescript
constructor(private user: string, callback: (err: string | undefined) => void) {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const fatherdir = path.resolve(__dirname, '..');
    const sourcedir = path.resolve(fatherdir, '..');
    this.route = path.join(sourcedir, `src/database/users/${this.user}`);
    this.readDir((err) => {
      if(err){
        callback(err);
      } else {
        callback(undefined);
      }
    });
  }
```

Luego hace uso de un método `readDir` que lee todo el directorio con la ruta anterior, probando su existencia primero, y para cada archivo encontrado, llama al método `JSON.parse` y crea un objeto `CardReader` con ese resultado, luego hace uso del método `returnCard` del objeto `CardReader` que devuelve una Carta ya creada y la añade al array de la colección:

```typescript
  readDir(callback: (err: string | undefined, success: number | undefined) => void): void {

    fs.readdir(this.route, (err, cards) => {
      if (err) {
        callback(err.message, undefined);
      } else {
        if(cards.length == 0) {
          callback(undefined, 0);
        } else {
          let cardCount = 0;
          cards.forEach((card) => {
            fs.readFile(`${this.route}/${card}`, 'utf-8', (err, content) => {
              const data: CardShape = JSON.parse(content);
              const reader: CardReader = new CardReader(data);
        
              this.collection.push(reader.returnCard());
              cardCount++;
              if(cardCount === cards.length) {
                callback(undefined, 0)
              }
            });
          });
        }
      } 
    });

  }
```

Al ser todo código asíncrono y ser este el primer paso de cualquier ejecución del programa, ésta es la clase "principal" de la que se anida el resto del código en cada acción. Por ende, todo el código principal de la aplicación utiliza el patrón callback chaining para funcionar y hacer uso de la API asíncrona de Node.

### CardCollectionWriter

Esta es la clase encargada de escribir los resultados de las operaciones sobre la colección en el directorio del usuario inicial. Para ello, hace uso del método `write()` que primero borra todos los archivos del directorio del usuario, para luego escribir las cartas de la colección cada una en un archivo `JSON` separado. Se ha optado por esta forma ya que simplifica mucho el manejo del sistema de archivos del ordenador.

```typescript
write(): void {
    // Limpia el directorio antes de escribir la colección
    this.clean((err) => {
      if(err){
        throw new Error(err);
      } else {
        // Escribe cada carta en un archivo JSON en el directorio
        this.collection.collection.forEach((card) => {
          const cardPath: string = path.join(this.route, `${card.name}.json`);
          fs.writeFile(cardPath, JSON.stringify(card), (err) => {
            if (err) {
              throw new Error(err.message);
            }
          });
        });
      } 
    });
  }
```

Como se puede observar, se utiliza un método 'clean' al que se le pasa un manejador por parámetro, esto es porque necesitamos esperar a borrar los archivos mediante la API asincrona de Node y para asegurarnos de ello debemos usar el patron callback nuevamente. El método `clean` luce de la siguiente manera:

```typescript
  clean(callback: (err: string | undefined) => void): void {
    fs.readdir(this.route, (err, files) => {
      if (err) {
        throw new Error(err.message);
      } else {
        if(files.length == 0) {
          callback(undefined);
        } else {
          let fileCount = 0;
          files.forEach((file) => {
            const filePath: string = path.join(this.route, file);
            // Elimina cada archivo en el directorio
            fs.unlink(filePath, (err) => {
              if (err) {
                throw new Error(err.message);
              } else {
                fileCount++;
                // Si todos los archivos han sido eliminados, llama al callback sin errores
                if(fileCount === files.length) {
                  callback(undefined);
                }
              }
            });
          });
        }
      }
    });
  }
```

## magic-client.ts

Este es el archivo principal del programa desde el lado del cliente, éste se encarga de utilizar yargs para parsear los argumentos invocados por linea de comandos según la acción que queramos pedirle realizar al servidor. Éstas son:

- add(): Añade una carta
- update(): Actualiza una carta
- remove(): Elimina una carta
- list(): Lista las cartas de un usuario
- read(): Lee una carta de un usuario

Para cada una de estas acciones, se crea un socket desde el lado del cliente para conectarse por el puerto `60300` al servidor, y se le manda un archivo JSON que siempre consta de un atributo `requestType` cuyo valor le indica al servidor que tipo de petición se le está realizando, por ejemplo, si invocamos el cliente con el comando **add** el server recibirá un JSON con `"requestType": "add"` así como un parámetro `card` con toda la información de la carta que queremos añadir. Pasa lo mismo con los otros comandos, siempre se le pasará al servidor un JSON con `requestType` y el resto de la información necesaria para esa acción. Así mismo, el cliente también recibe la respuesta del servidor, esto es, otro JSON con un parámetro `success` cuyo valor es **true** o **false** , indicando si la petición ha sido satisfactoria o no. El cliente, interpreta la respuesta del servidor, viendo que si `success` es true, se imprime por consola el mensaje llegado del servidor en verde y subrayado haciendo uso de `chalk`. En caso contrario, se escribe el mensaje recibido del server en rojo.

En caso de `list` y `read`, la respuesta del servidor no conlleva un mensaje sino una lista de cartas del usuario dado, éstas se imprimen por la consola del cliente haciendo uso de chalk para el color de la carta.

## magic-server.ts

Este es el programa principal del servidor, el server es un objeto tipo `EventEmitterServer`, de ésta manera se asegura que el mensaje llegado del cliente está completo sin necesidad de usar `.end()`. Esto se hace analizando el mensaje llegado desde el socket y cuando se encuentre **\n**, significa que el mensaje ha terminado, ya que este es el formato que se ha implementado para esta practica. Una vez encuentra el caracter \n, emite un evento de tipo 'message' para señalizar que se ha finalizado la recepción del mensaje. Y una vez se recibe el mensaje se procede a procesar la petición.

Primero se analiza el parámetro `requestType` del mensaje, para ver por donde se tiene que ejecutar el código, si es una petición tipo `add` por ejemplo, se lee la colección del usuario dado, se crea una colección con esas cartas y se crea la nueva carta con el parámetro `card` de la petición. Luego esta carta se añade a la colección creada y se escribe en el sistema de archivos de forma asíncrona. Al igual que la lectura, que es también asíncrona. Una vez se termina la operación, se le envía al cliente la respuesta con el parámetro `success` y el parámetro `message` (o la lista de carta si es una petición **list** o **read**), y se termina la conexión con el cliente mientras el servidor sigue ejecutándose.

## Ejercicio PE

En el ejercicio PE de esta semana, se ha trabajado con los sockets de Node para hacer una aplicación cliente servidor usando el patrón request-response de manera que al cliente se le proporcionaba un `filename` y se le enviaba al servidor, el server con ese filename tenía que spawnear los procesos `wc` y `cat` para contar cuantos caracteres tenía ese archivo y devolverlos al cliente y terminar su conexión. Para ello se hizo uso de las `pipes`. 

## Conclusiones

En esta práctica se ha profundizado en el desarrollo de código según los principios SOLID, así como familiarizarse con el uso de módulos `chalk` y `yargs`, así como de la API Asíncrona de Node.js para el manejo del sistema de archivos, los sockets de Node, el patrón callback y callback chaining y el patrón request-response. También del cubrimiento del código mediante Coveralls, la documentación del mismo mediante Typedoc y la gestión de calidad mediante SonarCloud.

## Bibliografía

- [Apuntes de la asignatura](https://ull-esit-inf-dsi-2324.github.io/typescript-theory/)
  - [Principios SOLID](https://ull-esit-inf-dsi-2324.github.io/typescript-theory/typescript-solid.html)
- [Apuntes de la asignatura sobre Node.js](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/)
  - [Sockets](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/nodejs-sockets.html)
  - [Callback y CallbackChaining](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/nodejs-http-callback-pattern.html)