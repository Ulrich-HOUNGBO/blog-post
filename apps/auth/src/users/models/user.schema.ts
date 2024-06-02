import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { Exclude } from 'class-transformer';

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
  @Prop()
  username: string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop({ nullable: true })
  profilePicture: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
