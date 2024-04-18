import { Card, CardColor, CardRarity, CardType } from "./Card.js";
import chalk from 'chalk';
import { Conjuro, Criatura, Encantamiento, Instantaneo, Planeswalker, Tierra, Artefacto } from "./CardTypes.js";
import { CardShape } from "./CollectionReader.js";

/**
 * Clase lectora de cartas
 */
export class CardReader {
  
  /**
   * El constructor de la clase
   * @param data Un objeto con forma CardShape, resultado de parsear el archivo JSON leído
   */
  constructor(private data: CardShape) {
    if(!this.data.Stats) {
      this.data.Stats =  {
        fuerza: 0,
        resistencia: 0
      }
    }
  }

  /**
   * Método para obtener el valor del enumerado tipo CardType a partir de un string equivalente, para crear los objetos tipo Card
   * @param type El string que corresponde con un valor del enumerado CardType
   * @returns El valor del enumerado correspondiente
   */
  private stringToCardType(type: string): CardType {
    return Object.values(CardType).find(value => value === type) as CardType;
  }

  /**
   * Método para obtener el valor del enumerado tipo CardColor a partir de un string equivalente, para crear los objetos tipo Card
   * @param type El string que corresponde con un valor del enumerado CardColor
   * @returns El valor del enumerado correspondiente
   */
  private stringToCardColor(type: string): CardColor {
    return Object.values(CardColor).find(value => value === type) as CardColor;
  }

  /**
   * Método para obtener el valor del enumerado tipo CardRarity a partir de un string equivalente, para crear los objetos tipo Card
   * @param type El string que corresponde con un valor del enumerado CardRarity
   * @returns El valor del enumerado correspondiente
   */
  private stringToCardRarity(type: string): CardRarity {
    return Object.values(CardRarity).find(value => value === type) as CardRarity;
  }

  /**
   * Método para crear los objetos tipo Carta
   * @returns Un Objeto tipo Carta con el JSON parseado del tipo de carta adecuado
   */
  returnCard(): Card {
    const cardType: CardType = this.stringToCardType(this.data.Type);
    const cardColor: CardColor = this.stringToCardColor(this.data.Color);
    const cardRarity: CardRarity = this.stringToCardRarity(this.data.Rarity);

    switch (cardType) {

      case CardType.tierra:

        return new Tierra(this.data.ID, this.data.Name, this.data.Cost, cardColor, cardType, cardRarity, this.data.Text, this.data.Price);

      case CardType.encantamiento:

        return new Encantamiento(this.data.ID, this.data.Name, this.data.Cost, cardColor, cardType, cardRarity, this.data.Text, this.data.Price);
      
      case CardType.conjuro:
        
        return new Conjuro(this.data.ID, this.data.Name, this.data.Cost, cardColor, cardType, cardRarity, this.data.Text, this.data.Price);
      
      case CardType.instantaneo:

        return new Instantaneo(this.data.ID, this.data.Name, this.data.Cost, cardColor, cardType, cardRarity, this.data.Text, this.data.Price);

      case CardType.artefacto:

        return new Artefacto(this.data.ID, this.data.Name, this.data.Cost, cardColor, cardType, cardRarity, this.data.Text, this.data.Price);
    
      case CardType.criatura:

        return new Criatura(this.data.ID, this.data.Name, this.data.Cost, cardColor, cardType, cardRarity, this.data.Text, this.data.Price, this.data.Stats);

      case CardType.planeswalker:
        
        return new Planeswalker(this.data.ID, this.data.Name, this.data.Cost, cardColor, cardType, cardRarity, this.data.Text, this.data.Price, this.data.Loyalty);

      default:
        throw new Error(chalk.red('Not a valid Card Type!'));
    }
  }

}