import { Global, Module } from '@nestjs/common';
import { EventService } from '@app/common/event/event.service';

@Global()
@Module({
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
