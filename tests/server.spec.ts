import 'mocha';
import {use, expect} from 'chai';
import chaiHttp from 'chai-http';

const chai = use(chaiHttp);

describe('Express server tests', () => {
  describe('GET tests', () => {

    it('Debería obtener las cartas de un user dado en la query string', (done) => {
      chai.request('http://localhost:3000').get('/cards?user=testuser').end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(true);
        expect(response.body.cards).to.have.deep.members([
        {
          "ID": 0,
          "Name": "test0",
          "Cost": 3,
          "Color": "azul",
          "Type": "artefacto",
          "Rarity": "comun",
          "Text": "hello",
          "Price": 8
        }
      ]);
      done();
      });
    });

    it('Debería obtener una carta concreta de un usuario dada una ID en la query string', (done) => {
      chai.request('http://localhost:3000').get('/cards?user=testuser&id=0').end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(true);
        expect(response.body.card).to.deep.eq(
        {
          "ID": 0,
          "Name": "test0",
          "Cost": 3,
          "Color": "azul",
          "Type": "artefacto",
          "Rarity": "comun",
          "Text": "hello",
          "Price": 8
        }
      );
      done();
      });
    });

    it('Debería devolver una respuesta insatisfactoria para un usuario que no existe', (done) => {
      chai.request('http://localhost:3000').get('/cards?user=pepito').end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(false);
        expect(response.body.message).to.include('no such file or directory');
      done();
      });
    });

    it('Debería devolver una respuesta insatisfactoria cuando no se le da un usuario', (done) => {
      chai.request('http://localhost:3000').get('/cards?id=0').end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(false);
        expect(response.body.message).to.eq('A user has to be provided');
      done();
      });
    });
  });

  describe('POST tests', () => {
    it('Debería devolver una respuesta satisfactoria se pide añadir una carta', (done) => {
      chai.request('http://localhost:3000').post('/cards?user=testuser')
      .send(
        {
        "ID": 1,
        "Name": "test1",
        "Cost": 5,
        "Color": "rojo",
        "Type": "planeswalker",
        "Rarity": "mitica",
        "Text": "hello",
        "Price": 8,
        "Loyalty": 9
      })
      .end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(true);
        expect(response.body.message).to.eq('New card added to the collection!');
      done();
      });
    });

    it('Debería devolver una respuesta insatisfactoria si se pide añadir una carta con parametros faltantes', (done) => {
      chai.request('http://localhost:3000').post('/cards?user=testuser')
      .send(
        {
        "ID": 1,
        "Name": "test1",
        "Cost": 5,
        "Color": "rojo",
        "Type": "planeswalker",
        "Rarity": "mitica",
        "Price": 8,
        "Loyalty": 9
      })
      .end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(false);
        expect(response.body.message).to.eq('Properties missing');
      done();
      });
    });

    it('Debería devolver una respuesta insatisfactoria si no se proporciona cuerpo', (done) => {
      chai.request('http://localhost:3000').post('/cards?user=testuser')
      .end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(false);
        expect(response.body.message).to.eq('Properties missing');
      done();
      });
    });

    it('Debería devolver una respuesta insatisfactoria si no se encuentra el user', (done) => {
      chai.request('http://localhost:3000').post('/cards?user=pepito&id=7').end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(false);
        expect(response.body.message).to.include('no such file or directory');
      done();
      });
    });

  });

  describe('DELETE tests', () => {
    it('Debería devolver una respuesta satisfactoria si se pide borrar una carta con id en la query string', (done) => {
      chai.request('http://localhost:3000').delete('/cards?user=testuser&id=1').end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(true);
        expect(response.body.message).to.eq('Card removed from the collection!');
      done();
      });
    });

    it('Debería devolver una respuesta insatisfactoria si no se da ID', (done) => {
      chai.request('http://localhost:3000').delete('/cards?user=testuser').end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(false);
        expect(response.body.message).to.eq('An ID has to be provided');
      done();
      });
    });

    it('Debería devolver una respuesta insatisfactoria si no se da user', (done) => {
      chai.request('http://localhost:3000').delete('/cards').end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(false);
        expect(response.body.message).to.eq('A user has to be provided');
      done();
      });
    });

    it('Debería devolver una respuesta insatisfactoria si no se encuentra ID', (done) => {
      chai.request('http://localhost:3000').delete('/cards?user=testuser&id=7').end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(false);
        expect(response.body.message).to.eq('Card not found');
      done();
      });
    });

    it('Debería devolver una respuesta insatisfactoria si no se encuentra el user', (done) => {
      chai.request('http://localhost:3000').delete('/cards?user=pepito&id=7').end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(false);
        expect(response.body.message).to.include('no such file or directory');
      done();
      });
    });
  });

  describe('PATCH tests', () => {

    it('Debería devolver una respuesta satisfactoria se pide actualizar una carta', (done) => {
      chai.request('http://localhost:3000').patch('/cards?user=testuser&id=0')
      .send(
        {
          "ID": 0,
          "Name": "test0",
          "Cost": 3,
          "Color": "rojo",
          "Type": "artefacto",
          "Rarity": "comun",
          "Text": "hello",
          "Price": 8
        }
      )
      .end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(true);
        expect(response.body.message).to.eq('Card updated in the collection!');
      done();
      });
    });

    it('Debería actualizar correctamente una carta', (done) => {
      chai.request('http://localhost:3000').patch('/cards?user=testuser&id=0')
      .send(
        {
          "ID": 0,
          "Name": "test0",
          "Cost": 3,
          "Color": "azul",
          "Type": "artefacto",
          "Rarity": "comun",
          "Text": "hello",
          "Price": 8
        }
      )
      .end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(true);
        expect(response.body.message).to.eq('Card updated in the collection!');
      done();
      });
    });

    it('Debería haber actualizado la carta correctamente', (done) => {
      chai.request('http://localhost:3000').get('/cards?user=testuser&id=0')
      .end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(true);
        expect(response.body.card).to.deep.eq(
          {
          "ID": 0,
          "Name": "test0",
          "Cost": 3,
          "Color": "azul",
          "Type": "artefacto",
          "Rarity": "comun",
          "Text": "hello",
          "Price": 8
        }
        );
      done();
      });
    });

    it('Debería devolver una respuesta insatisfactoria si no se proporciona cuerpo', (done) => {
      chai.request('http://localhost:3000').patch('/cards?user=testuser&id=0')
      .end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(false);
        expect(response.body.message).to.eq('Properties missing');
      done();
      });
    });

    it('Debería devolver una respuesta insatisfactoria si se pide añadir una carta con parametros faltantes', (done) => {
      chai.request('http://localhost:3000').patch('/cards?user=testuser&id=0')
      .send(
        {
        "ID": 1,
        "Name": "test1",
        "Cost": 5,
        "Color": "rojo",
        "Type": "planeswalker",
        "Rarity": "mitica",
        "Price": 8,
        "Loyalty": 9
      })
      .end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(false);
        expect(response.body.message).to.eq('Properties missing');
      done();
      });
    });

    it('Debería devolver insatisfactorio si no se da id en la query string', (done) => {
      chai.request('http://localhost:3000').patch('/cards?user=testuser')
      .send(
        {
          "ID": 0,
          "Name": "test0",
          "Cost": 3,
          "Color": "azul",
          "Type": "artefacto",
          "Rarity": "comun",
          "Text": "hello",
          "Price": 8
        }
      )
      .end((_, response) => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.eq(false);
        expect(response.body.message).to.eq('An ID has to be provided');
      done();
      });
    });

  });

});