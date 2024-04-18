import chalk from 'chalk';
import { CardCollection } from './Collection.js';

/**
 * Clase para imprimir las cartas de la colección
 */
export class CardCollectionPrinter {
  constructor(private collection: CardCollection) {}

  print(): void {
    console.log(chalk.bold.blue(`${this.collection.user} collection`))
    console.log(chalk.grey.bold('-'.repeat(50)));
    
    for (const card of this.collection.collection) {
      card.print();
    }

  }

}