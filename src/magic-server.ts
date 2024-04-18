import net from 'net';
import chalk from 'chalk';
import { EventEmitterServer } from './classes/EventEmitterServer.js';
import { CardCollectionReader } from './classes/CollectionReader.js';
import { CardCollection } from './classes/Collection.js';
import { Card, CardColor, CardRarity, CardType } from './classes/Card.js';
import { Artefacto, Conjuro, Criatura, Encantamiento, Instantaneo, Planeswalker, Tierra } from './classes/CardTypes.js';
import { CardCollectionWriter } from './classes/CollectionWriter.js';
import fs from 'fs';
import path from 'path';

/**
 * Programa principal del lado del server, recibe los JSON del cliente, se procesa la request y se accede al sistema de archivos según el tipo de operación que se pida, y le devuelve al cliente un JSON con un atributo success(true o false) y un string de respuesta, satisfactoria o no.
 */
net.createServer((connection) => {
  console.log(chalk.green('A client has connected.'));
  const server = new EventEmitterServer(connection);

  server.on('message', (message) => {
    if(message.requestType == 'add') {

      const reader: CardCollectionReader = new CardCollectionReader(message.user, (err) => {
        if (err) {
          throw new Error(err);
        } else {
          const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
          let card: Card;
          const cardType: CardType = message.card.Type as CardType;
          const cardColor: CardColor = message.card.Color as CardColor;
          const cardRarity: CardRarity = message.card.Rarity as CardRarity;
          const cardStrength: number = message.card.Stats.fuerza;
          const cardResistance: number = message.card.Stats.resistencia;
          const cardLoyalty: number = message.card.Loyalty;
          let resultString: string = '';
          
          switch (cardType) {
            case CardType.tierra:
              card = new Tierra(message.card.ID, message.card.Name, message.card.Cost, cardColor, cardType, cardRarity, message.card.Text, message.card.Price);
              resultString = collection.addCard(card);
              break;
        
            case CardType.encantamiento:
              card = new Encantamiento(message.card.ID, message.card.Name, message.card.Cost, cardColor, cardType, cardRarity, message.card.Text, message.card.Price);
              resultString = collection.addCard(card);
              break;
        
            case CardType.conjuro:
              card = new Conjuro(message.card.ID, message.card.Name, message.card.Cost, cardColor, cardType, cardRarity, message.card.Text, message.card.Price);
              resultString = collection.addCard(card);
              break;
        
            case CardType.instantaneo:
              card = new Instantaneo(message.card.ID, message.card.Name, message.card.Cost, cardColor, cardType, cardRarity, message.card.Text, message.card.Price);
              resultString = collection.addCard(card);
              break;
        
            case CardType.artefacto:
              card = new Artefacto(message.card.ID, message.card.Name, message.card.Cost, cardColor, cardType, cardRarity, message.card.Text, message.card.Price);
              resultString = collection.addCard(card);
              break;
        
            case CardType.criatura:
              card = new Criatura(message.card.ID, message.card.Name, message.card.Cost, cardColor, cardType, cardRarity, message.card.Text, message.card.Price, {fuerza: cardStrength, resistencia: cardResistance});
              resultString = collection.addCard(card);
              break;
        
            case CardType.planeswalker:
              card = new Planeswalker(message.card.ID, message.card.Name, message.card.Cost, cardColor, cardType, cardRarity, message.card.Text, message.card.Price, cardLoyalty);
              resultString = collection.addCard(card);
              break;
          
            default:
              throw new Error(chalk.red('No valid type!'));
          }
        
          const writer: CardCollectionWriter = new CardCollectionWriter(collection);
          writer.write();
          if(resultString == 'New card added to the collection!') {
            connection.write(JSON.stringify({'success': true, 'message': `${resultString}`}));
          } else {
            connection.write(JSON.stringify({'success': false, 'message': `${resultString}`}));
          }
          connection.end();
        }
      }); 

    } else if (message.requestType == 'update') {

      const reader: CardCollectionReader = new CardCollectionReader(message.user, (err) => {
        if (err) {
          throw new Error(err);
        } else {
          const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
          let card: Card;
          const cardType: CardType = message.card.Type as CardType;
          const cardColor: CardColor = message.card.Color as CardColor;
          const cardRarity: CardRarity = message.card.Rarity as CardRarity;
          const cardStrength: number = message.card.Stats.fuerza;
          const cardResistance: number = message.card.Stats.resistencia;
          const cardLoyalty: number = message.card.Loyalty;
          let resultString: string = '';
          
          switch (cardType) {
            case CardType.tierra:
              card = new Tierra(message.card.ID, message.card.Name, message.card.Cost, cardColor, cardType, cardRarity, message.card.Text, message.card.Price);
              resultString = collection.updateCard(card);
              break;
        
            case CardType.encantamiento:
              card = new Encantamiento(message.card.ID, message.card.Name, message.card.Cost, cardColor, cardType, cardRarity, message.card.Text, message.card.Price);
              resultString = collection.updateCard(card);
              break;
        
            case CardType.conjuro:
              card = new Conjuro(message.card.ID, message.card.Name, message.card.Cost, cardColor, cardType, cardRarity, message.card.Text, message.card.Price);
              resultString = collection.updateCard(card);
              break;
        
            case CardType.instantaneo:
              card = new Instantaneo(message.card.ID, message.card.Name, message.card.Cost, cardColor, cardType, cardRarity, message.card.Text, message.card.Price);
              resultString = collection.updateCard(card);
              break;
        
            case CardType.artefacto:
              card = new Artefacto(message.card.ID, message.card.Name, message.card.Cost, cardColor, cardType, cardRarity, message.card.Text, message.card.Price);
              resultString = collection.updateCard(card);
              break;
        
            case CardType.criatura:
              card = new Criatura(message.card.ID, message.card.Name, message.card.Cost, cardColor, cardType, cardRarity, message.card.Text, message.card.Price, {fuerza: cardStrength, resistencia: cardResistance});
              resultString = collection.updateCard(card);
              break;
        
            case CardType.planeswalker:
              card = new Planeswalker(message.card.ID, message.card.Name, message.card.Cost, cardColor, cardType, cardRarity, message.card.Text, message.card.Price, cardLoyalty);
              resultString = collection.updateCard(card);
              break;
          
            default:
              throw new Error(chalk.red('No valid type!'));
          }
        
          const writer: CardCollectionWriter = new CardCollectionWriter(collection);
          writer.write();
          if(resultString == 'Card updated in the collection!') {
            connection.write(JSON.stringify({'success': true, 'message': `${resultString}`}));
          } else {
            connection.write(JSON.stringify({'success': false, 'message': `${resultString}`}));
          }
          connection.end();
        }
      }); 
    
    } else if (message.requestType == 'remove') {
      let resultString: string = '';
      const reader: CardCollectionReader = new CardCollectionReader(message.user, (err) => {
        if (err) {
          throw new Error(err);
        } else {
          const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
          resultString = collection.deleteCard(message.id);
          const writer: CardCollectionWriter = new CardCollectionWriter(collection);
          writer.write();
          
          if(resultString == 'Card removed from the collection!') {
            connection.write(JSON.stringify({'success': true, 'message': `${resultString}`}));
          } else {
            connection.write(JSON.stringify({'success': false, 'message': `${resultString}`}));
          }
          connection.end();
        }
      });
    } else if (message.requestType == 'list') {
      const reader: CardCollectionReader = new CardCollectionReader(message.user, (err) => {
        if (err) {
          throw new Error(err);
        } else {
          const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
          const cards = collection.getCards();
          connection.write(JSON.stringify({cards}));
          connection.end();
        }
      });
    } else if (message.requestType == 'read') {
      const reader: CardCollectionReader = new CardCollectionReader(message.user, (err) => {
        if(err){
          throw new Error(err);
        } else {
          const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
          const card = collection.showCard(message.id);
          if (card) {
            connection.write(JSON.stringify({card}));
            connection.end();
          } else {
            connection.write(JSON.stringify({'card': undefined }));
            connection.end();
          }
        }
      });
    } else if (message.requestType == 'addUser') {
      const __dirname = path.dirname(new URL(import.meta.url).pathname);
      const sourcedir = path.resolve(__dirname, '..');
      const route = path.join(sourcedir, `src/database/users/${message.user}`);
      fs.access(route, (err) => {
        if(!err){
          connection.write(JSON.stringify({'success': false, 'message': 'User already exists!' }));
          connection.end();
        } else {
          fs.mkdir(route, {recursive: true}, (err) => {
            if(err){
              connection.write(JSON.stringify({'success': false,'message': `${err.message}` }));
              connection.end();
            } else {
              connection.write(JSON.stringify({'success': true,'message': 'User created succesfully!' }));
              connection.end();
            }
          });
        }
      });
    }

  });

  connection.on('close', () => {
    console.log(chalk.red('Un cliente se ha desconectado.'));
  });

}).listen(60300, () => {
  console.log(chalk.blue('Waiting for clients to connect...'));
});