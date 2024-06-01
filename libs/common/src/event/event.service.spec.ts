import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '@app/common';

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should emit and handle events', (done) => {
    service.on('testEvent', (data) => {
      expect(data).toBe('testData');
      done();
    });

    service.emit('testEvent', 'testData');
  });

  it('should not trigger event handlers after they are removed', (done) => {
    const handler = jest.fn();

    service.on('testEvent', handler);
    service.off('testEvent', handler);
    service.emit('testEvent', 'testData');

    setTimeout(() => {
      expect(handler).not.toHaveBeenCalled();
      done();
    }, 100);
  });
});
