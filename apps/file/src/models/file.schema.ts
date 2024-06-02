import { AbstractDocument } from '@app/common';
import { Prop } from '@nestjs/mongoose';

export enum EnumFileType {
  AUDIO = 'audio',
  VIDEO = 'video',
  IMAGE = 'image',
  DOCUMENT = 'document',
  OTHER = 'other',
}

export class FileAwsDocument extends AbstractDocument {
  @Prop()
  label: string;

  @Prop()
  path: string;

  @Prop()
  size: number;

  @Prop({ enum: EnumFileType, default: EnumFileType.OTHER })
  type: string;
}
