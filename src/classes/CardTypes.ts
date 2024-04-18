import { CardColor, CardType, CardRarity, Card } from "./Card.js";
import chalk from 'chalk';

/**
 * Interfaz para representar un objeto de tipo CardStats, que se compone de un valor numerico para la fuerza y otro para la resistencia
 */
export interface CardStats {
  fuerza: number,
  resistencia: number
}

/**
 * Clase que representa una carta de tipo Tierra
 */
export class Tierra extends Card {
  constructor(protected ID:number, protected Name: string, protected Cost: number, protected Color: CardColor, protected Type: CardType, protected Rarity: CardRarity, protected Text: string, protected Price: number) {
    super(ID, Name, Cost, Color, Type, Rarity, Text, Price);
  }
}

/**
 * Clase que representa una carta de tipo Encantamiento
 */
export class Encantamiento extends Card {
  constructor(protected ID:number, protected Name: string, protected Cost: number, protected Color: CardColor, protected Type: CardType, protected Rarity: CardRarity, protected Text: string, protected Price: number) {
    super(ID, Name, Cost, Color, Type, Rarity, Text, Price);
  }
}

/**
 * Clase que representa una carta de tipo Conjuro
 */
export class Conjuro extends Card {
  constructor(protected ID:number, protected Name: string, protected Cost: number, protected Color: CardColor, protected Type: CardType, protected Rarity: CardRarity, protected Text: string, protected Price: number) {
    super(ID, Name, Cost, Color, Type, Rarity, Text, Price);
  }
}

/**
 * Clase que representa una carta de tipo Instantaneo
 */
export class Instantaneo extends Card {
  constructor(protected ID:number, protected Name: string, protected Cost: number, protected Color: CardColor, protected Type: CardType, protected Rarity: CardRarity, protected Text: string, protected Price: number) {
    super(ID, Name, Cost, Color, Type, Rarity, Text, Price);
  }
}

/**
 * Clase que representa una carta de tipo Artefacto
 */
export class Artefacto extends Card {
  constructor(protected ID:number, protected Name: string, protected Cost: number, protected Color: CardColor, protected Type: CardType, protected Rarity: CardRarity, protected Text: string, protected Price: number) {
    super(ID, Name, Cost, Color, Type, Rarity, Text, Price);
  }
}

/**
 * Clase que representa una carta de tipo Criatura, tiene un atributo adicional de tipo CardStats para la fuerza y resistencia
 */
export class Criatura extends Card {
  
  constructor(protected ID:number, protected Name: string, protected Cost: number, protected Color: CardColor, protected Type: CardType, protected Rarity: CardRarity, protected Text: string, protected Price: number, protected Stats: CardStats) {
    super(ID, Name, Cost, Color, Type, Rarity, Text, Price);
  }

  /**
   * Devuelve las stats de la carta, objeto de tipo CardStats
   */
  get stats() {
    return this.Stats;
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
    console.log(chalk.white(chalk.bold.underline('Strength:') + ` ${this.stats.fuerza}`));
    console.log(chalk.white(chalk.bold.underline('Resistance:') + ` ${this.stats.resistencia}`));

    console.log(chalk.grey.bold('-'.repeat(50)));
  }
  
}

/**
 * Clase que representa una carta de tipo Planeswalker, atributo adicional Loyalty para las masrcas de lealtad
 */
export class Planeswalker extends Card {
  constructor(protected ID:number, protected Name: string, protected Cost: number, protected Color: CardColor, protected Type: CardType, protected Rarity: CardRarity, protected Text: string, protected Price: number, protected Loyalty: number) {
    super(ID, Name, Cost, Color, Type, Rarity, Text, Price);
  }

  /**
   * Devuelve las marcas de lealtad
   */
  get loyalty() {
    return this.Loyalty;
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
    console.log(chalk.white(chalk.bold.underline('Loyalty:') + ` ${this.loyalty}`));

    console.log(chalk.grey.bold('-'.repeat(50)));
  }

}