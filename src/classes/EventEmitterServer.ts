import {EventEmitter} from 'events';

/**
 * Clase para un server basada en las plantillas EventEmitter de los apuntes de la asignatura. Con ella se puede saber cuando un mensaje ha sido recibido por completo.
 */
export class EventEmitterServer extends EventEmitter {
  constructor(public connection: EventEmitter) {
    super();

    let wholeData = '';
    connection.on('data', (dataChunk) => {
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        this.emit('message', JSON.parse(message));
        messageLimit = wholeData.indexOf('\n');
      }
    });
  }
}