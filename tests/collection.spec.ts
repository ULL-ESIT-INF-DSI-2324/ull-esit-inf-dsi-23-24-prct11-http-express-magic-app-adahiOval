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
            "Color": "incoloro",
            "Cost": 3,
            "ID": 2,
            "Name": "tess",
            "Price": 6,
            "Rarity": "comun",
            "Text": "hello",
            "Type": "instantaneo"
          },
          {
            "Color": "rojo",
            "Cost": 7,
            "ID": 5,
            "Name": "testfinal",
            "Price": 70,
            "Rarity": "rara",
            "Stats": {
              "fuerza": 7,
              "resistencia": 5
            },
            "Text": "helloworld",
            "Type": "criatura"
          },
          {
            "Color": "rojo",
            "Cost": 1,
            "ID": 9,
            "Name": "testc",
            "Price": 8,
            "Rarity": "rara",
            "Text": "helloworld",
            "Type": "tierra"
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
        expect(collection.collection).to.have.deep.members([{
            "Color": "incoloro",
            "Cost": 3,
            "ID": 2,
            "Name": "tess",
            "Price": 6,
            "Rarity": "comun",
            "Text": "hello",
            "Type": "instantaneo"
          },
          {
            "Color": "rojo",
            "Cost": 7,
            "ID": 5,
            "Name": "testfinal",
            "Price": 70,
            "Rarity": "rara",
            "Stats": {
              "fuerza": 7,
              "resistencia": 5
            },
            "Text": "helloworld",
            "Type": "criatura"
          },
          {
            "Color": "rojo",
            "Cost": 1,
            "ID": 9,
            "Name": "testc",
            "Price": 8,
            "Rarity": "rara",
            "Text": "helloworld",
            "Type": "tierra"
          }, card1
        ]);
        done();
      }
    })
  });

  it('Se actualiza carta correctamente', (done) => {
    const card1: Artefacto = new Artefacto(1,'a',3,CardColor.rojo,CardType.artefacto,CardRarity.rara,'hola',3);
    const card2: Artefacto = new Artefacto(1,'a',3,CardColor.azul,CardType.artefacto,CardRarity.rara,'hola',3);
    const reader2: CardCollectionReader = new CardCollectionReader('adahi', (err) => {
      if(!err) {
        const collection: CardCollection = new CardCollection(reader2.getCollection(), reader2.getUser());
        collection.addCard(card1);
        expect(collection.collection).to.have.deep.members([{
          "Color": "incoloro",
          "Cost": 3,
          "ID": 2,
          "Name": "tess",
          "Price": 6,
          "Rarity": "comun",
          "Text": "hello",
          "Type": "instantaneo"
        },
        {
          "Color": "rojo",
          "Cost": 7,
          "ID": 5,
          "Name": "testfinal",
          "Price": 70,
          "Rarity": "rara",
          "Stats": {
            "fuerza": 7,
            "resistencia": 5
          },
          "Text": "helloworld",
          "Type": "criatura"
        },
        {
          "Color": "rojo",
          "Cost": 1,
          "ID": 9,
          "Name": "testc",
          "Price": 8,
          "Rarity": "rara",
          "Text": "helloworld",
          "Type": "tierra"
        }, card1
      ]);
        collection.updateCard(card2);
        expect(collection.collection).to.have.deep.members([{
            "Color": "incoloro",
            "Cost": 3,
            "ID": 2,
            "Name": "tess",
            "Price": 6,
            "Rarity": "comun",
            "Text": "hello",
            "Type": "instantaneo"
          },
          {
            "Color": "rojo",
            "Cost": 7,
            "ID": 5,
            "Name": "testfinal",
            "Price": 70,
            "Rarity": "rara",
            "Stats": {
              "fuerza": 7,
              "resistencia": 5
            },
            "Text": "helloworld",
            "Type": "criatura"
          },
          {
            "Color": "rojo",
            "Cost": 1,
            "ID": 9,
            "Name": "testc",
            "Price": 8,
            "Rarity": "rara",
            "Text": "helloworld",
            "Type": "tierra"
          }, card2
        ]);
        done();
      }
    })
  });

  it('Se elimina carta correctamente', (done) => {
    const card1: Artefacto = new Artefacto(1,'a',3,CardColor.rojo,CardType.artefacto,CardRarity.rara,'hola',3);
    const reader2: CardCollectionReader = new CardCollectionReader('adahi', (err) => {
      if(!err) {
        const collection: CardCollection = new CardCollection(reader2.getCollection(), reader2.getUser());
        collection.addCard(card1);
        expect(collection.collection).to.have.deep.members([{
            "Color": "incoloro",
            "Cost": 3,
            "ID": 2,
            "Name": "tess",
            "Price": 6,
            "Rarity": "comun",
            "Text": "hello",
            "Type": "instantaneo"
          },
          {
            "Color": "rojo",
            "Cost": 7,
            "ID": 5,
            "Name": "testfinal",
            "Price": 70,
            "Rarity": "rara",
            "Stats": {
              "fuerza": 7,
              "resistencia": 5
            },
            "Text": "helloworld",
            "Type": "criatura"
          },
          {
            "Color": "rojo",
            "Cost": 1,
            "ID": 9,
            "Name": "testc",
            "Price": 8,
            "Rarity": "rara",
            "Text": "helloworld",
            "Type": "tierra"
          }, card1
        ]);
        collection.deleteCard(1);
        expect(collection.collection).to.have.deep.members([{
          "Color": "incoloro",
          "Cost": 3,
          "ID": 2,
          "Name": "tess",
          "Price": 6,
          "Rarity": "comun",
          "Text": "hello",
          "Type": "instantaneo"
        },
        {
          "Color": "rojo",
          "Cost": 7,
          "ID": 5,
          "Name": "testfinal",
          "Price": 70,
          "Rarity": "rara",
          "Stats": {
            "fuerza": 7,
            "resistencia": 5
          },
          "Text": "helloworld",
          "Type": "criatura"
        },
        {
          "Color": "rojo",
          "Cost": 1,
          "ID": 9,
          "Name": "testc",
          "Price": 8,
          "Rarity": "rara",
          "Text": "helloworld",
          "Type": "tierra"
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
