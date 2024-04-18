import path from 'path';
import fs from 'fs';
import { CardCollection } from './Collection.js';


/**
 * Clase que se encarga de escribir una colección de cartas en el sistema de archivos.
 */
export class CardCollectionWriter {
  private route: string = '';

  /**
   * El constructor de la clase, se encarga de crear la ruta hasta el directorio del usuario dado.
   * @param collection La colección de cartas que se va a escribir en el sistema de archivos.
   */
  constructor(private collection: CardCollection) {
    // Calcula la ruta hasta el directorio del usuario
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const fatherdir1 = path.resolve(__dirname, '..');
    const fatherdir = path.resolve(fatherdir1, '..');
    this.route = path.join(fatherdir, `src/database/users/${this.collection.user}`);
  }

  /**
   * Elimina todos los archivos en el directorio de la colección de cartas, asincrona.
   * @param callback Una función de retorno que se llamará después de que se complete la limpieza. Recibe un error opcional.
   */
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

  /**
   * Escribe la colección de cartas en el sistema de archivos.
   */
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
}
