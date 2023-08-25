import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IOrder, OrderType } from '../types';

@Schema()
export class Order extends Document implements IOrder {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  tokenA: string;
  @Prop({ required: true })
  tokenB: string;
  @Prop({ required: true })
  user: string;
  @Prop({ required: true })
  type: OrderType;
  @Prop({ required: true })
  amountA: string;
  @Prop({ required: true })
  amountB: string;
  @Prop({ required: true })
  active: boolean;
  @Prop({ required: true })
  amountLeftToFill: string;
  @Prop({ required: true })
  amountReceived: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
