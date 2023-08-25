import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Block extends Document {
  @Prop({ required: true })
  height: string;
}

export const BlockSchema = SchemaFactory.createForClass(Block);
