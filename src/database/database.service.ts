import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.model';
import { Model } from 'mongoose';
import { IOrder } from '../types';
import { Block } from './latestBlock.model';


@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Block.name) private readonly blockModel: Model<Block>,
  ) {}

  async createOrder(order: IOrder) {
    const newOrder = new this.orderModel(order);
    return newOrder.save();
  }

  async findOrder(id: string) {
    return await this.orderModel.find({ id }).exec();
  }

  async updateOrder(id: string, data: Partial<IOrder>) {
    return await this.orderModel.updateOne({ id }, { $set: data }).exec();
  }

  async getOrders(data: Partial<IOrder>) {
    console.log('data: ', data)
    const res = await this.orderModel.find(data).exec();
    console.log(res);
    return res
  }

  async createHeight(block: string) {
    const newHeight = new this.blockModel({ height: block });
    return newHeight.save();
  }

  async getHeight() {
    const block = await this.blockModel.findOne().exec();

    if (block != null) {
      return Number(block.height);
    }
    return 0;
  }

  async updateHeight(blockNumber: string) {
    const oldHeight = await this.getHeight();

    if (oldHeight === 0) {
      await this.createHeight(blockNumber);
      return blockNumber;
    }

    await this.blockModel
      .updateOne({}, { $set: { height: blockNumber } })
      .exec();
  }
}
