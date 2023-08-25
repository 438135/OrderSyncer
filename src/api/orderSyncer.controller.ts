import { Controller, Get, Query } from '@nestjs/common';
import { OrderSyncerService } from './orderSyncer.service';
import { Order } from '../database/order.model';
import { GetOrdersRequestQueryDto } from "./dto/getOrders.dto";
import { GetMatchingOrdersRequestQueryDto } from "./dto/getMatchingOrders.dto";

@Controller()
export class OrderSyncerController {
  constructor(private readonly orderSyncer: OrderSyncerService) {}

  @Get('getOrders')
  async getOrders(@Query() data: GetOrdersRequestQueryDto): Promise<Order[]> {
    return this.orderSyncer.getOrders(data);
  }

  @Get('getMatchingOrders')
  async getMatchingOrders(@Query() data: GetMatchingOrdersRequestQueryDto): Promise<string[]>{
    return this.orderSyncer.getMatchingOrders(data);
  }
}
