import express from 'express';
import chalk from 'chalk';
import bodyParser from 'body-parser';
import { CardCollectionReader, CardShape } from './classes/CollectionReader.js';
import { CardCollection } from './classes/Collection.js';
import { Card, CardColor, CardRarity, CardType } from './classes/Card.js';
import { Artefacto, Conjuro, Criatura, Encantamiento, Instantaneo, Planeswalker, Tierra } from './classes/CardTypes.js';
import { CardCollectionWriter } from './classes/CollectionWriter.js';

const server = express();

server.use(bodyParser.json());

/**
 * Para las peticiones GET en la ruta /cards se utiliza la presencia del parámetro id en la query para determinar si se 
 * lista todas las cartas del usuario o solo la indicada por el parámetro id
 */
server.get('/cards', (req, res) => {
  if (!req.query.user) {
    res.send({
      success: false,
      message: 'A user has to be provided'
    });
  } else {
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
    } else {
      const reader: CardCollectionReader = new CardCollectionReader(req.query.user as string, (err) => {
        if(err){
          res.send({
            success: false,
            message: err
          });
        } else {
          const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
          const id: number = parseInt(req.query.id as string);
          if(isNaN(id)) {
            res.send({
              success: false,
              message: 'ID has to be a number'
            });
          } else {
            const card = collection.showCard(id);
            if (card) {
              res.send({
                success: true,
                card: card
              });
            } else {
              res.send({
                success: false,
                message: 'No note was found'
              });
            }
          }
        }
      });
    }
  }
});

/**
 * Para las peticiones POST de la ruta /cards se utiliza el cuerpo de la petición, para ello se ha tenido que hacer uso 
 * de bodyParser, en caso de no usarlo se devolvía undefined en las peticiones 
 */
server.post('/cards', (req, res) => {
  if (!req.query.user) {
    res.send({
      success: false,
      message: 'A user has to be provided'
    });
  } else if (!req.body) {
    res.send({
      success: false,
      message: 'A card has to be provided'
    });
  } else {
    const reader: CardCollectionReader = new CardCollectionReader(req.query.user as string, (err) => {
      if (err) {
        res.send({
          success: false,
          message: err
        });
      } else {
        const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
        let card: Card;

        const queryCard: CardShape = req.body;
        if(!('ID' in queryCard) || !('Name' in queryCard) || !('Cost' in queryCard) || !('Color' in queryCard) || !('Type' in queryCard) || !('Rarity' in queryCard) || !('Text' in queryCard) || !('Price' in queryCard)) {
          res.send({
            success: false,
            message: 'Properties missing'
          });
        } else {
          const cardType: CardType = queryCard.Type as CardType;
        const cardColor: CardColor = queryCard.Color as CardColor;
        const cardRarity: CardRarity = queryCard.Rarity as CardRarity;
        let cardStrength: number = 0;
        let cardResistance: number = 0;
        let cardLoyalty: number = 0;

        if('Stats' in queryCard) {
          cardStrength = queryCard.Stats.fuerza;
          cardResistance = queryCard.Stats.resistencia;
        }
        
        if('Loyalty' in queryCard) {
          cardLoyalty = queryCard.Loyalty;
        }

        let resultString: string = '';
        
        switch (cardType) {
          case CardType.tierra:
            card = new Tierra(queryCard.ID, queryCard.Name, queryCard.Cost, cardColor, cardType, cardRarity, queryCard.Text, queryCard.Price);
            resultString = collection.addCard(card);
            break;
      
          case CardType.encantamiento:
            card = new Encantamiento(queryCard.ID, queryCard.Name, queryCard.Cost, cardColor, cardType, cardRarity, queryCard.Text, queryCard.Price);
            resultString = collection.addCard(card);
            break;
      
          case CardType.conjuro:
            card = new Conjuro(queryCard.ID, queryCard.Name, queryCard.Cost, cardColor, cardType, cardRarity, queryCard.Text, queryCard.Price);
            resultString = collection.addCard(card);
            break;
      
          case CardType.instantaneo:
            card = new Instantaneo(queryCard.ID, queryCard.Name, queryCard.Cost, cardColor, cardType, cardRarity, queryCard.Text, queryCard.Price);
            resultString = collection.addCard(card);
            break;
      
          case CardType.artefacto:
            card = new Artefacto(queryCard.ID, queryCard.Name, queryCard.Cost, cardColor, cardType, cardRarity, queryCard.Text, queryCard.Price);
            resultString = collection.addCard(card);
            break;
      
          case CardType.criatura:
            card = new Criatura(queryCard.ID, queryCard.Name, queryCard.Cost, cardColor, cardType, cardRarity, queryCard.Text, queryCard.Price, {fuerza: cardStrength, resistencia: cardResistance});
            resultString = collection.addCard(card);
            break;
      
          case CardType.planeswalker:
            card = new Planeswalker(queryCard.ID, queryCard.Name, queryCard.Cost, cardColor, cardType, cardRarity, queryCard.Text, queryCard.Price, cardLoyalty);
            resultString = collection.addCard(card);
            break;
        
          default:
            res.send({
              success: false,
              message: 'No valid type'
            });
        }
      
        const writer: CardCollectionWriter = new CardCollectionWriter(collection);
        writer.write();
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
        }
      }
    }); 
  }
});

server.delete('/cards', (req, res) => {
  if (!req.query.user) {
    res.send({
      success: false,
      message: 'A user has to be provided'
    });
  } else {
    if(!req.query.id) {
      res.send({
        success: false,
        message: 'An ID has to be provided'
      });
    } else {
      const reader: CardCollectionReader = new CardCollectionReader(req.query.user as string, (err) => {
        if(err){
          res.send({
            success: false,
            message: err
          });
        } else {
          const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
          const id: number = parseInt(req.query.id as string);
          if(isNaN(id)) {
            res.send({
              success: false,
              message: 'ID has to be a number'
            });
          } else {
            const resultString = collection.deleteCard(id);
            const writer: CardCollectionWriter = new CardCollectionWriter(collection);
            writer.write();
            
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
          }
        }
      });
    }
  }
});

server.patch('/cards', (req, res) => {
  if (!req.query.user) {
    res.send({
      success: false,
      message: 'A user has to be provided'
    });
  } else if (!req.body) {
    res.send({
      success: false,
      message: 'A card has to be provided'
    });
  } else if (!req.query.id) {
    res.send({
      success: false,
      message: 'An ID has to be provided'
    });
  } else {
    const reader: CardCollectionReader = new CardCollectionReader(req.query.user as string, (err) => {
      if (err) {
        res.send({
          success: false,
          message: err
        });
      } else {
        const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
        let card: Card;

        const queryCard: CardShape = req.body;
        if(!('ID' in queryCard) || !('Name' in queryCard) || !('Cost' in queryCard) || !('Color' in queryCard) || !('Type' in queryCard) || !('Rarity' in queryCard) || !('Text' in queryCard) || !('Price' in queryCard)) {
          res.send({
            success: false,
            message: 'Properties missing'
          });
        } else {
          const cardType: CardType = queryCard.Type as CardType;
        const cardColor: CardColor = queryCard.Color as CardColor;
        const cardRarity: CardRarity = queryCard.Rarity as CardRarity;
        let cardStrength: number = 0;
        let cardResistance: number = 0;
        let cardLoyalty: number = 0;

        if('Stats' in queryCard) {
          cardStrength = queryCard.Stats.fuerza;
          cardResistance = queryCard.Stats.resistencia;
        }
        
        if('Loyalty' in queryCard) {
          cardLoyalty = queryCard.Loyalty;
        }

        let resultString: string = '';
        
        switch (cardType) {
          case CardType.tierra:
            card = new Tierra(queryCard.ID, queryCard.Name, queryCard.Cost, cardColor, cardType, cardRarity, queryCard.Text, queryCard.Price);
            resultString = collection.updateCard(card);
            break;
      
          case CardType.encantamiento:
            card = new Encantamiento(queryCard.ID, queryCard.Name, queryCard.Cost, cardColor, cardType, cardRarity, queryCard.Text, queryCard.Price);
            resultString = collection.updateCard(card);
            break;
      
          case CardType.conjuro:
            card = new Conjuro(queryCard.ID, queryCard.Name, queryCard.Cost, cardColor, cardType, cardRarity, queryCard.Text, queryCard.Price);
            resultString = collection.updateCard(card);
            break;
      
          case CardType.instantaneo:
            card = new Instantaneo(queryCard.ID, queryCard.Name, queryCard.Cost, cardColor, cardType, cardRarity, queryCard.Text, queryCard.Price);
            resultString = collection.updateCard(card);
            break;
      
          case CardType.artefacto:
            card = new Artefacto(queryCard.ID, queryCard.Name, queryCard.Cost, cardColor, cardType, cardRarity, queryCard.Text, queryCard.Price);
            resultString = collection.updateCard(card);
            break;
      
          case CardType.criatura:
            card = new Criatura(queryCard.ID, queryCard.Name, queryCard.Cost, cardColor, cardType, cardRarity, queryCard.Text, queryCard.Price, {fuerza: cardStrength, resistencia: cardResistance});
            resultString = collection.updateCard(card);
            break;
      
          case CardType.planeswalker:
            card = new Planeswalker(queryCard.ID, queryCard.Name, queryCard.Cost, cardColor, cardType, cardRarity, queryCard.Text, queryCard.Price, cardLoyalty);
            resultString = collection.updateCard(card);
            break;
        
          default:
            res.send({
              success: false,
              message: 'No valid type'
            });
        }
      
        const writer: CardCollectionWriter = new CardCollectionWriter(collection);
        writer.write();
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
        }
      }
    }); 
  }
});

server.listen(3000, () => {
  console.log(chalk.blue('Server is up on port 3000'));
});