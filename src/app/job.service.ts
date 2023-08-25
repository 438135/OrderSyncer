import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';

import {
  Event,
  IOrder,
  OrderCancelledValues,
  OrderCreatedValues,
  OrderMatchedValues,
  OrderType,
} from '../types';
import { DEFAULT_INTERVAL, ABI } from '../constants';

@Injectable()
export class JobService implements OnApplicationBootstrap {
  private readonly contract;
  private readonly web3: Web3;
  constructor(
    private readonly config: ConfigService,
    private readonly db: DatabaseService,
  ) {
    const nodeUrl = this.config.get<string>('NODE_URL');
    if (nodeUrl != null) {
      this.web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
    }

    this.contract = new this.web3.eth.Contract(
      ABI,
      this.config.get<string>('CONTRACT_ADDRESS'),
    );
  }

  async onApplicationBootstrap() {
    const syncJobInterval = this.config.get<number>(
      'SYNC_JOB_INTERVAL',
      DEFAULT_INTERVAL,
    );
    let blockNumber: number | 'earliest' = 'earliest';
    setInterval(async () => {
      try {
        await this.sync(blockNumber);
      } catch (error) {
        throw new Error(`Failed to get contract events. Error: ${error}`);
      }

      blockNumber = await this.db.getHeight();
    }, syncJobInterval);
  }

  async sync(fromBlock: number | 'earliest') {
    const options = {
      filter: {},
      fromBlock: fromBlock,
      toBlock: 'latest',
    };

    const data: Event[] = await this.contract
      .getPastEvents('allEvents', options)
      .then(async (res) => {
        for (const event of res) {
          switch (event.event) {
            case 'OrderCreated':
              await this.createOrder(event.returnValues as OrderCreatedValues);
              break;
            case 'OrderMatched':
              await this.matchOrder(event.returnValues as OrderMatchedValues);
              break;
            case 'OrderCancelled':
              await this.cancelOrder(event.returnValues as OrderCancelledValues);
              break;
            default:
              break;
          }

          await this.db.updateHeight(event.blockNumber.toString());
        }
      });
  }
  async createOrder(order: OrderCreatedValues) {
    const { id, tokenA, tokenB, user, amountA, amountB, isMarket } = order;
    const oldOrder = await this.db.findOrder(id.toString());

    if (oldOrder.length === 0) {
      const newOrder: IOrder = {
        id: id.toString(),
        tokenA: tokenA.toLowerCase(),
        tokenB: tokenB.toLowerCase(),
        type: isMarket ? OrderType.Market : OrderType.Limit,
        user: user.toLowerCase(),
        amountA: amountA.toString(),
        amountB: amountB.toString(),
        active: true,
        amountLeftToFill: amountA.toString(),
        amountReceived: '0',
      };

      await this.db.createOrder(newOrder);
    } else {
      await this.db.updateOrder(id.toString(), {
        amountLeftToFill: oldOrder[0].amountA,
        amountReceived: '0',
        active: true });
    }
  }

  async matchOrder(order: OrderMatchedValues) {
    const { id, amountReceived, amountLeftToFill } = order;
    const [orderForMatch] = await this.db.findOrder(id.toString());
    const newAmountReceived = BigInt(orderForMatch.amountReceived) + amountReceived;

    if (amountLeftToFill === BigInt(0)) {
      await this.db.updateOrder(id.toString(), {
        amountLeftToFill: '0',
        amountReceived: newAmountReceived.toString(),
        active: false,
      });

      return;
    }

    const newAmountLeftToFill = amountLeftToFill.toString();

    if (newAmountReceived !== BigInt(orderForMatch.amountA)) {
      await this.db.updateOrder(id.toString(), {
        amountLeftToFill: newAmountLeftToFill,
        amountReceived: newAmountReceived.toString(),
      });

      return;
    }

    await this.db.updateOrder(id.toString(), {
      amountReceived: orderForMatch.amountA,
      amountLeftToFill: '0',
      active: false,
    });
  }

  async cancelOrder(order: OrderCancelledValues) {
    const { id } = order;
    const oldOrder = await this.db.findOrder(id.toString());

    if (oldOrder.length === 0) {
      throw new Error(`Can't find order for canceling.`);
    }

    await this.db.updateOrder(id.toString(), { active: false });
  }
}
