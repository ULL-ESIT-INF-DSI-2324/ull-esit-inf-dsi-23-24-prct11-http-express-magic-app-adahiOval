import 'mocha';
import { expect } from 'chai';
import { CardCollection } from '../src/classes/Collection.js';
import { CardCollectionReader } from '../src/classes/CollectionReader.js';
import { Artefacto, Criatura } from '../src/classes/CardTypes.js';
import { CardColor, CardRarity, CardType } from '../src/classes/Card.js';

describe('CardCollection tests', () => {

  it('Se lee el directorio correctamente y se crean las cartas correspondientes', (done) => {
    const reader1: CardCollectionReader = new CardCollectionReader('adahi', (err) => {
      if(!err) {
        expect(reader1.getCollection()).to.have.deep.members([{
          "ID": 1,
          "Name": "test1",
          "Cost": 3,
          "Color": "azul",
          "Type": "criatura",
          "Rarity": "comun",
          "Text": "hello",
          "Price": 8,
          "Stats": {
            "fuerza": 5,
            "resistencia": 5
          }
        },
        {
          "ID": 2,
          "Name": "test2",
          "Cost": 3,
          "Color": "verde",
          "Type": "instantaneo",
          "Rarity": "comun",
          "Text": "hello",
          "Price": 8
        },
        {
          "ID": 5,
          "Name": "testfinal",
          "Cost": 7,
          "Color": "rojo",
          "Type": "criatura",
          "Rarity": "rara",
          "Text": "helloworld",
          "Price": 70,
          "Stats": {
            "fuerza": 7,
            "resistencia": 5
          }
        },
        {
          "ID": 9,
          "Name": "testc",
          "Cost": 1,
          "Color": "rojo",
          "Type": "tierra",
          "Rarity": "rara",
          "Text": "helloworld",
          "Price": 8
        }]);
        done();
      }
    })
  });

  it('Se añade carta correctamente', (done) => {
    const card1: Artefacto = new Artefacto(1,'a',3,CardColor.rojo,CardType.artefacto,CardRarity.rara,'hola',3);
    const reader2: CardCollectionReader = new CardCollectionReader('adahi', (err) => {
      if(!err) {
        const collection: CardCollection = new CardCollection(reader2.getCollection(), reader2.getUser());
        collection.addCard(card1);
        expect(collection.collection).to.have.deep.members([ {
          "ID": 1,
          "Name": "test1",
          "Cost": 3,
          "Color": "azul",
          "Type": "criatura",
          "Rarity": "comun",
          "Text": "hello",
          "Price": 8,
          "Stats": {
            "fuerza": 5,
            "resistencia": 5
          }
        },
        {
          "ID": 2,
          "Name": "test2",
          "Cost": 3,
          "Color": "verde",
          "Type": "instantaneo",
          "Rarity": "comun",
          "Text": "hello",
          "Price": 8
        },
        {
          "ID": 5,
          "Name": "testfinal",
          "Cost": 7,
          "Color": "rojo",
          "Type": "criatura",
          "Rarity": "rara",
          "Text": "helloworld",
          "Price": 70,
          "Stats": {
            "fuerza": 7,
            "resistencia": 5
          }
        },
        {
          "ID": 9,
          "Name": "testc",
          "Cost": 1,
          "Color": "rojo",
          "Type": "tierra",
          "Rarity": "rara",
          "Text": "helloworld",
          "Price": 8
        }
        ]);
        done();
      }
    })
  });

  it('Se actualiza carta correctamente', (done) => {
    const card1: Artefacto = new Artefacto(12,'a',3,CardColor.rojo,CardType.artefacto,CardRarity.rara,'hola',3);
    const card2: Artefacto = new Artefacto(12,'a',3,CardColor.azul,CardType.artefacto,CardRarity.rara,'hola',3);
    const reader2: CardCollectionReader = new CardCollectionReader('adahi', (err) => {
      if(!err) {
        const collection: CardCollection = new CardCollection(reader2.getCollection(), reader2.getUser());
        collection.addCard(card1);
        expect(collection.collection).to.have.deep.members([{
          "ID": 1,
          "Name": "test1",
          "Cost": 3,
          "Color": "azul",
          "Type": "criatura",
          "Rarity": "comun",
          "Text": "hello",
          "Price": 8,
          "Stats": {
            "fuerza": 5,
            "resistencia": 5
          }
        },
        {
          "ID": 2,
          "Name": "test2",
          "Cost": 3,
          "Color": "verde",
          "Type": "instantaneo",
          "Rarity": "comun",
          "Text": "hello",
          "Price": 8
        },
        {
          "ID": 5,
          "Name": "testfinal",
          "Cost": 7,
          "Color": "rojo",
          "Type": "criatura",
          "Rarity": "rara",
          "Text": "helloworld",
          "Price": 70,
          "Stats": {
            "fuerza": 7,
            "resistencia": 5
          }
        },
        {
          "ID": 9,
          "Name": "testc",
          "Cost": 1,
          "Color": "rojo",
          "Type": "tierra",
          "Rarity": "rara",
          "Text": "helloworld",
          "Price": 8
        }, card1
      ]);
        collection.updateCard(card2);
        expect(collection.collection).to.have.deep.members([{
          "ID": 1,
          "Name": "test1",
          "Cost": 3,
          "Color": "azul",
          "Type": "criatura",
          "Rarity": "comun",
          "Text": "hello",
          "Price": 8,
          "Stats": {
            "fuerza": 5,
            "resistencia": 5
          }
        },
        {
          "ID": 2,
          "Name": "test2",
          "Cost": 3,
          "Color": "verde",
          "Type": "instantaneo",
          "Rarity": "comun",
          "Text": "hello",
          "Price": 8
        },
        {
          "ID": 5,
          "Name": "testfinal",
          "Cost": 7,
          "Color": "rojo",
          "Type": "criatura",
          "Rarity": "rara",
          "Text": "helloworld",
          "Price": 70,
          "Stats": {
            "fuerza": 7,
            "resistencia": 5
          }
        },
        {
          "ID": 9,
          "Name": "testc",
          "Cost": 1,
          "Color": "rojo",
          "Type": "tierra",
          "Rarity": "rara",
          "Text": "helloworld",
          "Price": 8
        }, card2
        ]);
        done();
      }
    })
  });

  it('Se elimina carta correctamente', (done) => {
    const card1: Artefacto = new Artefacto(13,'a',3,CardColor.rojo,CardType.artefacto,CardRarity.rara,'hola',3);
    const reader2: CardCollectionReader = new CardCollectionReader('adahi', (err) => {
      if(!err) {
        const collection: CardCollection = new CardCollection(reader2.getCollection(), reader2.getUser());
        collection.addCard(card1);
        expect(collection.collection).to.have.deep.members([
           {
            ID: 1,
            Name: 'test1',
            Cost: 3,
            Color: 'azul',
            Type: 'criatura',
            Rarity: 'comun',
            Text: 'hello',
            Price: 8,
            Stats: { fuerza: 5, resistencia: 5 }
          },
           {
            ID: 9,
            Name: 'testc',
            Cost: 1,
            Color: 'rojo',
            Type: 'tierra',
            Rarity: 'rara',
            Text: 'helloworld',
            Price: 8
          },
           {
            ID: 2,
            Name: 'test2',
            Cost: 3,
            Color: 'verde',
            Type: 'instantaneo',
            Rarity: 'comun',
            Text: 'hello',
            Price: 8
          },
           {
            ID: 5,
            Name: 'testfinal',
            Cost: 7,
            Color: 'rojo',
            Type: 'criatura',
            Rarity: 'rara',
            Text: 'helloworld',
            Price: 70,
            Stats: { fuerza: 7, resistencia: 5 }
          },
           {
            ID: 13,
            Name: 'a',
            Cost: 3,
            Color: 'rojo',
            Type: 'artefacto',
            Rarity: 'rara',
            Text: 'hola',
            Price: 3
          }
        ]);
        collection.deleteCard(13);
        expect(collection.collection).to.have.deep.members([{
          ID: 1,
          Name: 'test1',
          Cost: 3,
          Color: 'azul',
          Type: 'criatura',
          Rarity: 'comun',
          Text: 'hello',
          Price: 8,
          Stats: { fuerza: 5, resistencia: 5 }
        },
         {
          ID: 9,
          Name: 'testc',
          Cost: 1,
          Color: 'rojo',
          Type: 'tierra',
          Rarity: 'rara',
          Text: 'helloworld',
          Price: 8
        },
         {
          ID: 2,
          Name: 'test2',
          Cost: 3,
          Color: 'verde',
          Type: 'instantaneo',
          Rarity: 'comun',
          Text: 'hello',
          Price: 8
        },
         {
          ID: 5,
          Name: 'testfinal',
          Cost: 7,
          Color: 'rojo',
          Type: 'criatura',
          Rarity: 'rara',
          Text: 'helloworld',
          Price: 70,
          Stats: { fuerza: 7, resistencia: 5 }
        }
      ]);
        done();
      }
    })
  });

  it('Se muestra carta correctamente', (done) => {
    const card1: Criatura = new Criatura(5,'testfinal',7,CardColor.rojo,CardType.criatura,CardRarity.rara,'helloworld',70,{fuerza: 7, resistencia: 5});
    const reader2: CardCollectionReader = new CardCollectionReader('adahi', (err) => {
      if(!err) {
        const collection: CardCollection = new CardCollection(reader2.getCollection(), reader2.getUser());
        expect(collection.showCard(5)).to.deep.eq(card1);
        done();
      }
    })
  });

});
