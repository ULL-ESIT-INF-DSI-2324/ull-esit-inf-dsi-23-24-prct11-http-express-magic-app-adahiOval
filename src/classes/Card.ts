import chalk from 'chalk';

/**
 * Enumerado que estipula los colores de las cartas
 */
export enum CardColor {
  blanco = 'blanco',
  negro = 'negro',
  azul = 'azul',
  rojo = 'rojo',
  verde = 'verde',
  incoloro = 'incoloro',
  multicolor = 'multicolor'
}

/**
 * Enumerado que estipula los tipos de cartas
 */
export enum CardType {
  tierra = 'tierra',
  criatura = 'criatura',
  encantamiento = 'encantamiento',
  conjuro = 'conjuro',
  instantaneo = 'instantaneo',
  artefacto = 'artefacto',
  planeswalker = 'planeswalker'
}

/**
 * Enumerado que estipula los tiers de rareza de las cartas
 */
export enum CardRarity {
  comun = 'comun',
  infrecuente = 'infrecuente',
  rara = 'rara',
  mitica = 'mitica'
}


export abstract class Card {
  
  constructor(protected ID: number, protected Name: string, protected Cost: number, protected Color: CardColor, protected Type: CardType, protected Rarity: CardRarity, protected Text: string, protected Price: number) {}

 
  /**
   * Devuelve el identificador de la carta
   */
  get id() {
    return this.ID;
  }

  /**
   * Devuelve el nombre de la carta
   */
  get name() {
    return this.Name;
  }

  /**
   * Devuelve el costo de la carta
   */
  get cost() {
    return this.Cost;
  }

  /**
   * Devuelve el color de la carta
   */
  get color() {
    return this.Color;
  }

  /**
   * Devuelve el tipo de la carta
   */
  get type() {
    return this.Type;
  }

  /**
   * Devuelve la rareza de la carta
   */
  get rarity() {
    return this.Rarity;
  }

  /**
   * Devuelve el texto de la carta
   */
  get text() {
    return this.Text;
  }

  /**
   * Devuelve el precio de la carta
   */
  get price() {
    return this.Price;
  }

  print(): void {
    console.log(chalk.white(chalk.bold.underline('ID:') + ` ${this.id}`));
    console.log(chalk.white(chalk.bold.underline('Name:') + ` ${this.name}`));
    console.log(chalk.white(chalk.bold.underline('Cost:') + ` ${this.cost}`));

    switch (this.color) {
      case CardColor.azul:
        console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.blue(` ${this.color}`)));
        break;

      case CardColor.blanco:
        console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.white(` ${this.color}`)));
        break;

      case CardColor.negro:
        console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.blackBright(` ${this.color}`)));
        break;

      case CardColor.rojo:
        console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.red(` ${this.color}`)));
        break;
    
      case CardColor.verde:
        console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.green(` ${this.color}`)));
        break;
    
      case CardColor.incoloro:
        console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.whiteBright(` ${this.color}`)));
        break;

      case CardColor.multicolor:
        console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.bgYellowBright(` ${this.color}`)));
        break;

      default:
        break;
    }

    console.log(chalk.white(chalk.bold.underline('Type:') + ` ${this.type}`));
    console.log(chalk.white(chalk.bold.underline('Rarity:') + ` ${this.rarity}`));
    console.log(chalk.white(chalk.bold.underline('Text:') + ` ${this.text}`));
    console.log(chalk.white(chalk.bold.underline('Price:') + ` ${this.price}`));

    console.log(chalk.grey.bold('-'.repeat(50)));
  }

}