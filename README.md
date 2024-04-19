## Introducción

En esta práctica se presenta un ejercicio para familiarizarnos con el manejo de Express y las peticiones HTTP, así 
como con los principios SOLID. Se ha desarrollado el ejercicio en la carpeta `src` que implementa un server
utilizando Express, y sus correspondientes pruebas en la carpeta `test`.

Para la instalación de las dependencias necesarias para hacer funcionar el código solo es necesario el comando:

```bash
npm install
```

Para el testeo y las peticiones posibles los objetos JSON que estén adjuntos a las peticiones representando una carta deben de ser de esta manera en caso de ser una carta normal:

```JSON
{
  "ID": 2,
  "Name": "test2",
  "Cost": 3,
  "Color": "verde",
  "Type": "instantaneo",
  "Rarity": "comun",
  "Text": "hello",
  "Price": 8
}
```

En caso de ser una criatura:

```JSON
{
  "ID": 1,
  "Name": "test1",
  "Cost": 3,
  "Color": "azul",
  "Type": "criatura",
  "Rarity": "comun",
  "Text": "hello",
  "Price": 8,
  "Stats": {
    "fuerza": 5,
    "resistencia": 5
  }
}
```

Y en caso de ser un Planeswalker:

```JSON
{
    "ID": 3,
    "Name": "test3",
    "Cost": 3,
    "Color": "multicolor",
    "Type": "planeswalker",
    "Rarity": "comun",
    "Text": "hello",
    "Price": 8,
    "Loyalty": 8
}
```

## Objetivos

Los objetivos de esta práctica son la familiarización con Express, así como los principios SOLID de 
programación orientada a objetos y también la implementación de coveralls en nuestro código, el patrón 
callback y los sockets y la programación asincrona con la api asincrona de Node para el sistema de archivos. 

## Clases

Las clases desarrolladas para esta práctica son las siguientes, como en la práctica anterior:

 - Card: Clase base de los distintos tipos de cartas, con sus correspondientes atributos
 - CardCollection: Coleccion de cartas.
 - CardCollectionReader: Lector de Coleccion de cartas a partir de un directorio de un usuario
 - CardCollectionPrinter: Printer de una coleccion de cartas dada
 - CardCollectionWriter: Escritor de la coleccion de cartas en el directorio del usuario de la misma
 - CardReader: Lector de carta individual a partir de un objeto JSON

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

## magic-express-server.ts

Este es el archivo principal donde se ha desarrollado la práctica. Se ha usado `express` para crear el server y `bodyParser` para que el server fuera capaz de acceder al cuerpo de las request, también se ha usado `Thunder Client` para hacer peticiones HTTP al servidor y probar su funcionamiento. 

```typescript
const server = express();

server.use(bodyParser.json());
```

Todas las peticiones serán en la ruta `/cards`, por ende se abstendrá de mencionar la ruta de nuevo, solo los cambios en los verbos HTTP. También todas los manejadores para las peticiones siguen el mismo formato:

  1. Comprobación de la query string para el usuario
  2. Comprobación de la query string para los demás argumentos necesarios (ID)
  3. Comprobación del cuerpo de la petición para ajuste de forma

De la misma manera las respuestas también siguen siempre el mismo formato, con un parámetro `success` que puede ser `true` o `false` y con otro parámetro que puede ser `cards`, `card` o `message` según el tipo de petición que estemos haciendo y si es satisfactoria o no. En caso de una respuesta insatisfactoria siempre se devolverá al usuario una respuesta con este formato:

```JSON
{
  "success": false,
  "message": '~Error message~'
}
```

En todos los casos para el manejo del sistema de archivos, las cartas y las colecciones el servidor hace uso de la estructura de clases creada en anteriores prácticas y discutida anteriormente en este informe.

### Peticiones GET

En primer lugar, se define el comportamiento del server ante una petición tipo `get`. Este verbo tiene la particularidad de que se usa de manera doble, es decir, si se le proporciona en la *query string* un **ID** al servidor este devolverá una respuesta que además del parámetro success tendrá un parámetro `card` con la carta encontrada con el **ID** dado en la *query string*. En caso contrario, se listarán todas las cartas del usuario y se devolverá una respuesta con `success` y `cards`, siendo cards el array con todas las cartas del usuario dado. Para distinguir, se comprueba si la *query string* tiene un parámetro **ID** y se ejecuta un código u otro según el caso. Pongamos el ejemplo del código sin **ID** en la *query string*:

```typescript
if(!req.query.id) {
  const reader: CardCollectionReader = new CardCollectionReader(req.query.user as string, (err) => {
    if (err) {
      res.send({
        success: false,
        message: err
      });
    } else {
      const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
      const userCards = collection.getCards();
      res.send({
        success: true,
        cards: userCards
      });
    }
  });
}
```

Como se puede observar se hace uso de la estructura de clases creada en anteriores prácticas y discutida anteriormente.

### Peticiones POST

Las peticiones tipo `POST` se atribuyen a una solicitud de creación de cartas para un usuario concreto. Por ello, se toman las mismas medidas y se comprueba que la *query string* contenga un usuario al que asignarle la petición. En el caso de este tipo de peticiones, se requiere también que la petición tenga `body`, ya que es donde estará definida la carta como un objeto `JSON` que el servidor parseará y creará en el sistema de archivos. La validez del objeto JSON se comprueba de la siguiente manera:

```typescript
  const queryCard: CardShape = req.body;
  if(!('ID' in queryCard) || !('Name' in queryCard) || !('Cost' in queryCard) || !('Color' in queryCard) || !('Type' in queryCard) || !('Rarity' in queryCard) || !('Text' in queryCard) || !('Price' in queryCard)) {
    res.send({
      success: false,
      message: 'Properties missing'
    });
  }
```

Una vez comprobada la validez del objeto `JSON` del cuerpo de la petición se procede a crear la carta a partir de él y añadirla a la colección haciendo uso del método `addCard()` de la clase `CardCollection`. Tras ello se crea un objeto `CardCollectionWriter` a partir de la colección ya modificada, creada originalmente a partir de un objeto `CardCollectionReader` y se invoca a su método `write()` que escribe esta colección en el sistema de archivos. Tras ello se devuelve la respuesta basada en el string resultante al añadir la carta a la colección:

```typescript
if(resultString == 'New card added to the collection!') {
  res.send({
    success: true,
    message: resultString
  });
} else {
  res.send({
    success: false,
    message: resultString
  });
}
```

### Peticiones PATCH

Este tipo de peticiones es muy parecido al anterior, ya que el servidor las maneja de forma diferente. También se requiere un usuario y un cuerpo, y además un ID en la *query string*. Este ID es necesario para reconocer la carta que se va a modificar en la colección. Se utilizan los mismos métodos de parseo y comprobación que en el apartado anterior para demostrar la validez del cuerpo de la petición, y se crea la carta a partir del mismo. Una vez creada se llama al método `updateCard` de la colección para actualizarla y devuelve un string como resultado. Y de la misma forma que antes se escribe en el sistema de archivos y se devuelve una respuesta al cliente:

```typescript
if(resultString == 'Card updated in the collection!') {
  res.send({
    success: true,
    message: resultString
  });
} else {
  res.send({
    success: false,
    message: resultString
  });
}
```

### Peticiones DELETE

Este es el último tipo de peticiones desarrollado para esta práctica, en ella se requiere un `user` (como en todas) y un `ID` en la *query string*. El servidor procesa la petición de manera que se asegura que existe **user** e **id** en la *query string* y en caso contrario manda una respuesta insatisfactoria al cliente. En caso de que esté todo lo necesario, lee la colección del usuario con un `CardCollectionReader`, en caso de haber algún error devuelve una respuesta insatisfactoria al cliente y en caso contrario, crea la colección e invoca al método `deleteCard` de la misma que devuelve un string resultante y luego escribe de nuevo la colección en el sistema de archivos, ya actualizada. Y devuelve una respuesta, satisfactoria o no, basada en el string resultante del método invocado:

```typescript
if(resultString == 'Card removed from the collection!') {
  res.send({
    success: true,
    message: resultString
  });
} else {
  res.send({
    success: false,
    message: resultString
  });
}
```

## Ejercicio PE

En el ejercicio PE de esta semana, se ha trabajado con funciones ya escritas usando la API síncrona de Node para trabajar con el sistema de archivos y se han transformado a funciones asíncronas utilizando el patrón callback y callback chaining. Estas funciones fueron `writeCard` y `readCard` que leen y escriben una carta en el sistema de archivos. Ambas crean una ruta a partir de los parámetros dados utilizando el módulo `path` y ambas reciben un callback como parámetro. En el caso de `writeCard`, se le pasa un usuario y una carta tipo `Card` y la escribe como objeto JSON en el sistema de archivos haciendo uso de la API asíncrona de node de esta manera:

```typescript
export const writeCard = (user: string, card: Card, callback: (err: string | undefined, data: string | undefined) => void) => {
    
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const route = path.join(__dirname, `database/users/${user}/${card.name}.json`);

    fs.writeFile(route, JSON.stringify(card), (err) => {
        if (err) {
            callback(`Error al escribir la colección.`, undefined);
        } else {
            callback(undefined, `Escritura realizada correctamente.`);
        }
    });
}
```

Como se puede observar se hace uso del patrón callback y se llama al callback con el orden de los argumentos adecuados para el funcionamiento del código asíncrono y se devuelve un string con el resultado (satisfactorio o no) de la operación.

En caso de `readCard` funciona de la misma manera, solo que haciendo uso de `fs.readFile` y devolviendo en el callback un objeto tipo `Card` en caso de ser exitoso:

```typescript
export const readCard = (user: string, card: string, callback: (err: string | undefined, collection: Card | undefined) => void) => {
    
    
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const route = path.join(__dirname, `database/users/${user}/${card}`);

    fs.readFile(route,'utf-8', (err, data) => {
        if(err) {
            callback("Error al leer la carta.", undefined);
        } else {
            const content: Card = JSON.parse(data);
            callback(undefined, content);
        }
    })
  }
```

## Pruebas

En esta práctica se han tenido que desarrollar las pruebas de manera un tanto diferente. En el enunciado, se recomendaba el uso del paquete `request`, pero al no conseguir hacerlo funcionar y tras investigación por mi parte se decidió pivotar hacia el uso de `chai-http` ya que existen varios artículos que recomiendan su uso para probar APIs con mocha y chai en typescript/javascript. Se encontraron problemas con la importación y el uso de los módulos necesarios pero tras indagar lo suficiente se encontró una solución para ello. Gracias a eso, se pudieron desarrollar las pruebas satisfactoriamente, que cubren todos los casos posibles en cada uno de los verbos y tipos de peticiones desarrolladas para la práctica, bajo el sistema de archivos en un directorio llamado `testuser`. 

## Conclusiones

En esta práctica se ha profundizado en el desarrollo de código según los principios SOLID, así como familiarizarse con `express` y la creación de servidores capaces de recibir peticiones HTTP y devolver lo necesario de cada una, así como de la API Asíncrona de Node.js para el manejo del sistema de archivos, el patrón callback y callback chaining y las peticiones HTTP y los clientes como `Thunder Client` para emitir estas peticiones. También de como hacer pruebas para un servidor utilizando mocha y chai.

## Bibliografía

- [Apuntes de la asignatura](https://ull-esit-inf-dsi-2324.github.io/typescript-theory/)
  - [Principios SOLID](https://ull-esit-inf-dsi-2324.github.io/typescript-theory/typescript-solid.html)
- [Apuntes de la asignatura sobre Node.js](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/)
  - [Express](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/nodejs-express.html)
  - [Callback y CallbackChaining](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/nodejs-http-callback-pattern.html)
- [Pruebas con chai-http](https://www.paradigmadigital.com/dev/testeo-api-rest-mocha-chai-http/)
- [Más pruebas con chai-http](https://ubuverse.com/introduction-to-node-js-api-unit-testing-with-mocha-and-chai/)
  - [Post de Reddit sobre errores de importación con typescript](https://www.reddit.com/r/node/comments/1af6r52/help_with_chai/)