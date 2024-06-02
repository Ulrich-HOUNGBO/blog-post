import { SchemaTypes } from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class AbstractDocument {
  @Prop({ type: SchemaTypes.String, default: () => uuidv4() })
  _id: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: false })
  deleted: boolean;
}
