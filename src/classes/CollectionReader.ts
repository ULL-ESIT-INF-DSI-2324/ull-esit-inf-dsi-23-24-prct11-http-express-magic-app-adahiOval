import { Card } from "./Card.js";
import path from 'path';
import fs from 'fs';
import { CardStats } from "./CardTypes.js";
import { CardReader } from "./CardReader.js";

/**
 * Interfaz para comprobar la forma de un JSON leído
 */
export interface CardShape {
  ID: number,
  Name: string,
  Cost: number,
  Color: string,
  Type: string,
  Rarity: string,
  Text: string,
  Price: number,
  Stats: CardStats,
  Loyalty: number
}

export class CardCollectionReader  {

  private collection: Card[] = [];
  private route: string = '';

  /**
   * El constructor de la clase, se encarga de crear la ruta hasta el directorio del usuario dado
   * @param user El usuario del que se crea el objeto colección
   * @param callback Función callback para que el código asincrono funcione correctamente al iniciar el objeto
   */
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

  /**
   * Método para leer el directorio de un usuario concreto, asincrono.
   * @param callback La funcion callback que se ejecutará cuando se la llame dentro de la función
   */
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

  /**
   * Método para devolver las cartas de un usuario concreto
   * @returns Un array de cartas del usuario
   */
  getCollection(): Card[] {
    return this.collection;
  }

  /**
   * Método para devolver el usuario de la colección leída
   * @returns El usuario de la coleccion leida
   */
  getUser(): string {
    return this.user;
  }

}