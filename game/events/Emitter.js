let instance = null;

class EventEmitter extends Phaser.Events.EventEmitter {
  constructor() {
    super();
  }

  static getInstance() {
    if (instance === null) {
      instance = new EventEmitter();
    }

    return instance;
  }
}
