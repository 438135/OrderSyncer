import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { IOrder, OrderType } from '../types';
import { GetOrdersRequestQueryDto } from './dto/getOrders.dto';
import { GetMatchingOrdersRequestQueryDto } from './dto/getMatchingOrders.dto';
import { ORDERS_FIELDS } from '../constants';

@Injectable()
export class OrderSyncerService {
  constructor(private readonly database: DatabaseService) {}



  async getOrders(data: GetOrdersRequestQueryDto) {
    const dataForSearch = {};
    for (const field of ORDERS_FIELDS) {
      const { name } = field;

      const value = data[name];

      // eslint-disable-next-line no-prototype-builtins
      if (data.hasOwnProperty(name)) {
        dataForSearch[name] = field.string ? value.toLowerCase() : value;
      }
    }

    return await this.database.getOrders(dataForSearch);
  }

  async getMatchingOrders(data: GetMatchingOrdersRequestQueryDto): Promise<string[]> {
    const { tokenA, tokenB, amountA, amountB, isMarket } = data;
    const allOrders = await this.database.getOrders({
      tokenA: tokenB,
      tokenB: tokenA,
      active: true,
    });
    const idForMatch: string[] = [];
    const orderType = (isMarket === true || amountA === '0') ? OrderType.Market : OrderType.Limit;

    if (orderType === 'Limit') {
      const price = Number(amountB)/Number(amountA);

      allOrders.filter((order: IOrder) => {
        const orderPrice = Number(order.amountA)/Number(order.amountB);

        if (
          price <= orderPrice
          && Number(order.amountA) >= Number(amountA)
        ) {
          idForMatch.push(order.id);
        }
      });
    } else {
      let bestOrderPrise = Number(0);
      let bestOrderId;
      allOrders.forEach((order: IOrder) => {
        const orderPrice = Number(order.amountB)/Number(order.amountA);

        if (
          Number(order.amountA) >= Number(amountB)
          && orderPrice > bestOrderPrise
        ) {
          bestOrderPrise = orderPrice;
          bestOrderId = order.id;
        }
      });

      if (bestOrderPrise != Number(0)) {
        idForMatch.push(bestOrderId);
      }
    }

    return idForMatch;
  }
}
