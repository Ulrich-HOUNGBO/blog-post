import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'eventemitter3';

@Injectable()
export class EventService extends EventEmitter {
  constructor() {
    super();
  }
}
