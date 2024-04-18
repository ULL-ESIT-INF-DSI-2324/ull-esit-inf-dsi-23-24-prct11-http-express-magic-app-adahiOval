import { Card } from "./Card.js";
import { CardCollectionPrinter } from "./CollectionPrinter.js";

/**
 * Clase que representa una colección de cartas.
 */
export class CardCollection {

  /**
   * Constructor de la clase CardCollection.
   * @param collection La colección de cartas.
   * @param user El usuario al que pertenece la colección.
   */
  constructor(public collection: Card[], public user: string) {}

  /**
   * Elimina una carta de la colección.
   * @param id El identificador de la carta a eliminar.
   * @returns Un mensaje indicando el resultado de la operación.
   */
  deleteCard(id: number): string {
    if (this.inCollection(id)) {
      this.collection = this.collection.filter((element) => element.id !== id);
      return 'Card removed from the collection!';
    } else {
      return 'Card not found';
    }
  }

  /**
   * Agrega una carta a la colección.
   * @param card La carta a agregar.
   * @returns Un mensaje indicando el resultado de la operación.
   */
  addCard(card: Card): string {
    if (this.inCollection(card.id)) {
      return 'Card already in collection';
    } else {
      this.collection.push(card);
      return 'New card added to the collection!';
    }
  }

  /**
   * Actualiza una carta en la colección.
   * @param card La carta actualizada.
   * @returns Un mensaje indicando el resultado de la operación.
   */
  updateCard(card: Card): string {
    if (this.inCollection(card.id)) {
      this.deleteCard(card.id);
      this.collection.push(card);
      return 'Card updated in the collection!';
    } else {
      return 'Card doesnt exist in this collection!';
    }
  }

  /**
   * Obtiene una carta de la colección por su identificador.
   * @param id El identificador de la carta.
   * @returns La carta encontrada o undefined si no se encuentra.
   */
  showCard(id: number): Card | undefined {
    if (this.inCollection(id)) {
      return this.collection.find((card) => card.id === id)!;
    } else {
      return undefined;
    }
  }

  /**
   * Verifica si una carta está en la colección.
   * @param cardID El identificador de la carta.
   * @returns true si la carta está en la colección, false de lo contrario.
   */
  private inCollection(cardID: number): boolean {
    return this.collection.some((card) => card.id === cardID);
  }

  /**
   * Lista las cartas de la colección.
   */
  listCollection(): void {
    const printer: CardCollectionPrinter = new CardCollectionPrinter(this);
    printer.print();
  }

  /**
   * Obtiene todas las cartas de la colección.
   * @returns Un array con todas las cartas de la colección.
   */
  getCards(): Card[] {
    return this.collection;
  }

}
