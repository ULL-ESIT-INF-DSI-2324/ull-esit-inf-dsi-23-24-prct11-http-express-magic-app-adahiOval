import net from 'net';
import { CardColor, CardType, CardRarity } from './classes/Card.js';
import yargs from 'yargs';
import chalk from 'chalk';
import {hideBin} from 'yargs/helpers';
import { CardShape } from './classes/CollectionReader.js';

/**
 * Programa principal del lado del cliente, cada comando se encarga de enviar un JSON por el socket con el tipo de request que le está haciendo al server (add, update, remove...) además de la información asociada a ese tipo de request, por ejemplo para add manda un atributo 'card' en el JSON con los datos de la carta.
 */
yargs(hideBin(process.argv))
  .command('add', 'Adds a card to the collection', {
  user: {
      description: 'Username',
      type: 'string',
      demandOption: true
  },
  id: {
   description: 'Card ID',
   type: 'number',
   demandOption: true
  },
  name: {
    description: 'Card Name',
    type: 'string',
    demandOption: true
  },
  cost: {
    description: 'Card Cost',
    type: 'number',
    demandOption: true
  },
  color: {
    description: 'Card Name',
    type: 'string',
    demandOption: true,
    choices: Object.values(CardColor)
  },
  type: {
    description: 'Card Type',
    type: 'string',
    demandOption: true,
    choices: Object.values(CardType)
  },
  rarity: {
    description: 'Card Rarity',
    type: 'string',
    demandOption: true,
    choices: Object.values(CardRarity)
  },
  text: {
    description: 'Card Text',
    type: 'string',
    demandOption: true
  },
  price: {
    description: 'Card Price',
    type: 'number',
    demandOption: true
  },
  loyalty: {
    description: 'Planeswalker loyalty',
    type: 'number',
    demandOption: false
  },
  strength: {
    description: 'Card Strength',
    type: 'number',
    demandOption: false
  },
  resistance: {
    description: 'Card Resistance',
    type: 'number',
    demandOption: false
  }
 }, (argv) => {
  
  const client = net.connect({port: 60300}, () => {
    console.log(chalk.green('Connection established.'));
  });

  const card: CardShape = {
    ID: argv.id,
    Name: argv.name,
    Cost: argv.cost,
    Color: argv.color,
    Type: argv.type,
    Rarity: argv.rarity,
    Text: argv.text,
    Price: argv.price,
    Stats: {
      fuerza: 0,
      resistencia: 0
    },
    Loyalty: 0
  }

  if (argv.type == CardType.criatura && typeof argv.strength === 'number' && typeof argv.resistance === 'number') {
    card.Stats.fuerza = argv.strength;
    card.Stats.resistencia = argv.resistance;
  } else if (argv.type === CardType.criatura && !argv.strength) {
    throw new Error('Stats not found.');
  } else if (argv.type == CardType.planeswalker && typeof argv.loyalty === 'number') {
    card.Loyalty = argv.loyalty;
  } else if (argv.type === CardType.planeswalker && !argv.strength) {
    throw new Error('Stats not found.');
  }

  let response = '';

  client.write(JSON.stringify({'requestType': 'add', 'user': argv.user, card}) + '\n');

  client.on('data', (data) => {
    response += data;
  });

  client.on('end', () => {
    if(JSON.parse(response).success) {
      console.log(chalk.green(chalk.underline(JSON.parse(response).message)));
    } else {
      console.log(chalk.red(chalk.underline(JSON.parse(response).message)));
    }
  });

 })
 .command('update', 'Updates a card from the collection', {
  
  user: {
      description: 'Username',
      type: 'string',
      demandOption: true
  },
  id: {
   description: 'Card ID',
   type: 'number',
   demandOption: true
  },
  name: {
    description: 'Card Name',
    type: 'string',
    demandOption: true
  },
  cost: {
    description: 'Card Cost',
    type: 'number',
    demandOption: true
  },
  color: {
    description: 'Card Name',
    type: 'string',
    demandOption: true
  },
  type: {
    description: 'Card Type',
    type: 'string',
    demandOption: true
  },
  rarity: {
    description: 'Card Rarity',
    type: 'string',
    demandOption: true
  },
  text: {
    description: 'Card Text',
    type: 'string',
    demandOption: true
  },
  price: {
    description: 'Card Price',
    type: 'number',
    demandOption: true
  },
  loyalty: {
    description: 'Planeswalker loyalty',
    type: 'number',
    demandOption: false
  },
  strength: {
    description: 'Card Strength',
    type: 'number',
    demandOption: false
  },
  resistance: {
    description: 'Card Resistance',
    type: 'number',
    demandOption: false
  }
 }, (argv) => {
  const client = net.connect({port: 60300}, () => {
    console.log(chalk.green('Connection established.'));
  });

  const card: CardShape = {
    ID: argv.id,
    Name: argv.name,
    Cost: argv.cost,
    Color: argv.color,
    Type: argv.type,
    Rarity: argv.rarity,
    Text: argv.text,
    Price: argv.price,
    Stats: {
      fuerza: 0,
      resistencia: 0
    },
    Loyalty: 0
  }

  if (argv.type == CardType.criatura && typeof argv.strength === 'number' && typeof argv.resistance === 'number') {
    card.Stats.fuerza = argv.strength;
    card.Stats.resistencia = argv.resistance;
  } else if (argv.type === CardType.criatura && !argv.strength) {
    throw new Error('Stats not found.');
  } else if (argv.type == CardType.planeswalker && typeof argv.loyalty === 'number') {
    card.Loyalty = argv.loyalty;
  } else if (argv.type === CardType.planeswalker && !argv.strength) {
    throw new Error('Stats not found.');
  }

  client.write(JSON.stringify({'requestType': 'update', 'user': argv.user, card}) + '\n');

  let response = '';

  client.on('data', (data) => {
    response += data;
  });

  client.on('end', () => {
    if(JSON.parse(response).success) {
      console.log(chalk.green(chalk.underline(JSON.parse(response).message)));
    } else {
      console.log(chalk.red(chalk.underline(JSON.parse(response).message)));
    }
  });

 })
 .command('remove', 'Removes a card from the collection', {
  
  user: {
    description: 'Username',
    type: 'string',
    demandOption: true
  },
  id: {
   description: 'Card ID',
   type: 'number',
   demandOption: true
  }
 }, (argv) => {
  const client = net.connect({port: 60300}, () => {
    console.log(chalk.green('Connection established.'));
  });

  client.write(JSON.stringify({'requestType': 'remove', 'user': argv.user,'id': argv.id}) + '\n');

  let response = '';

  client.on('data', (data) => {
    response += data;
  });

  client.on('end', () => {
    if(JSON.parse(response).success) {
      console.log(chalk.green(chalk.underline(JSON.parse(response).message)));
    } else {
      console.log(chalk.red(chalk.underline(JSON.parse(response).message)));
    }
  });

 })
 .command('list', 'Lists the cards from the collection', {
  
  user: {
    description: 'Username',
    type: 'string',
    demandOption: true
  }
 }, (argv) => {
  const client = net.connect({port: 60300}, () => {
    console.log(chalk.green('Connection established.'));
  });

  client.write(JSON.stringify({'requestType': 'list', 'user': argv.user}) + '\n');

  let response = '';

  client.on('data', (data) => {
    response += data;
  });

  client.on('end', () => {
    console.log(chalk.bold.blue(`${argv.user} collection`))
    console.log(chalk.grey.bold('-'.repeat(50)));
    const cards: CardShape[] = JSON.parse(response).cards;
    cards.forEach(card => {
      console.log(chalk.white(chalk.bold.underline('ID:') + ` ${card.ID}`));
      console.log(chalk.white(chalk.bold.underline('Name:') + ` ${card.Name}`));
      console.log(chalk.white(chalk.bold.underline('Cost:') + ` ${card.Cost}`));
  
      switch (card.Color) {
        case CardColor.azul:
          console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.blue(` ${card.Color}`)));
          break;
  
        case CardColor.blanco:
          console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.white(` ${card.Color}`)));
          break;
  
        case CardColor.negro:
          console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.blackBright(` ${card.Color}`)));
          break;
  
        case CardColor.rojo:
          console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.red(` ${card.Color}`)));
          break;
      
        case CardColor.verde:
          console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.green(` ${card.Color}`)));
          break;
      
        case CardColor.incoloro:
          console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.whiteBright(` ${card.Color}`)));
          break;
  
        case CardColor.multicolor:
          console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.bgYellowBright(` ${card.Color}`)));
          break;
  
        default:
          break;
      }
  
      console.log(chalk.white(chalk.bold.underline('Type:') + ` ${card.Type}`));
      console.log(chalk.white(chalk.bold.underline('Rarity:') + ` ${card.Rarity}`));
      console.log(chalk.white(chalk.bold.underline('Text:') + ` ${card.Text}`));
      console.log(chalk.white(chalk.bold.underline('Price:') + ` ${card.Price}`));

      if(card.Stats) {
        console.log(chalk.white(chalk.bold.underline('Fuerza:') + ` ${card.Stats.fuerza}`));
        console.log(chalk.white(chalk.bold.underline('Resistencia:') + ` ${card.Stats.resistencia}`));
      }

      if(card.Loyalty) {
        console.log(chalk.white(chalk.bold.underline('Loyalty:') + ` ${card.Loyalty}`));
      }
  
      console.log(chalk.grey.bold('-'.repeat(50)));
    });
  });

 })
 .command('read', 'Reads a card from the collection', {
  
  user: {
    description: 'Username',
    type: 'string',
    demandOption: true
  },
  id: {
   description: 'Card ID',
   type: 'number',
   demandOption: true
  }
 }, (argv) => {
  const client = net.connect({port: 60300}, () => {
    console.log(chalk.green('Connection established.'));
  });

  client.write(JSON.stringify({'requestType': 'read', 'user': argv.user,'id': argv.id}) + '\n');

  let response = '';

  client.on('data', (data) => {
    response += data;
  });

  client.on('end', () => {
    const card: CardShape = JSON.parse(response).card;
    if(card) {
      console.log(chalk.white(chalk.bold.underline('ID:') + ` ${card.ID}`));
      console.log(chalk.white(chalk.bold.underline('Name:') + ` ${card.Name}`));
      console.log(chalk.white(chalk.bold.underline('Cost:') + ` ${card.Cost}`));
  
      switch (card.Color) {
        case CardColor.azul:
          console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.blue(` ${card.Color}`)));
          break;
  
        case CardColor.blanco:
          console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.white(` ${card.Color}`)));
          break;
  
        case CardColor.negro:
          console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.blackBright(` ${card.Color}`)));
          break;
  
        case CardColor.rojo:
          console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.red(` ${card.Color}`)));
          break;
      
        case CardColor.verde:
          console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.green(` ${card.Color}`)));
          break;
      
        case CardColor.incoloro:
          console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.whiteBright(` ${card.Color}`)));
          break;
  
        case CardColor.multicolor:
          console.log(chalk.white(chalk.bold.underline('Color:') + chalk.bold.bgYellowBright(` ${card.Color}`)));
          break;
  
        default:
          break;
      }
  
      console.log(chalk.white(chalk.bold.underline('Type:') + ` ${card.Type}`));
      console.log(chalk.white(chalk.bold.underline('Rarity:') + ` ${card.Rarity}`));
      console.log(chalk.white(chalk.bold.underline('Text:') + ` ${card.Text}`));
      console.log(chalk.white(chalk.bold.underline('Price:') + ` ${card.Price}`));

      if(card.Stats) {
        console.log(chalk.white(chalk.bold.underline('Fuerza:') + ` ${card.Stats.fuerza}`));
        console.log(chalk.white(chalk.bold.underline('Resistencia:') + ` ${card.Stats.resistencia}`));
      }

      if(card.Loyalty) {
        console.log(chalk.white(chalk.bold.underline('Loyalty:') + ` ${card.Loyalty}`));
      }
  
      console.log(chalk.grey.bold('-'.repeat(50)));
    } else {
      console.log(chalk.red('Card not found!'));
    }
  });

 })
 .command('addUser', 'Adds a user to the server', {
  
  user: {
    description: 'Username',
    type: 'string',
    demandOption: true
  }
 }, (argv) => {
  const client = net.connect({port: 60300}, () => {
    console.log(chalk.green('Connection established.'));
  });

  client.write(JSON.stringify({'requestType': 'addUser', 'user': argv.user}) + '\n');

  let response = '';

  client.on('data', (data) => {
    response += data;
  });

  client.on('end', () => {
    if (JSON.parse(response).success) {
      console.log(chalk.green(JSON.parse(response).message));
    } else {
      console.log(chalk.red(JSON.parse(response).message));
    }
  });

 })
 
 .help()
 .argv;