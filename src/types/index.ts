export enum OrderType {
  Market = 'Market',
  Limit = 'Limit',
}

export interface IOrder {
  id: string;
  tokenA: string;
  tokenB: string;
  type: OrderType;
  user: string;
  amountA: string;
  amountB: string;
  active: boolean;
  amountLeftToFill: string;
  amountReceived: string;
}

export type Event = {
  address: string;
  blockHash: string;
  blockNumber: bigint;
  data: string;
  logIndex: bigint;
  removed: boolean;
  topics: string[];
  transactionHash: string;
  transactionIndex: bigint;
  returnValues: OrderCreatedValues | OrderMatchedValues | OrderCancelledValues;
  event: 'OrderCreated' | 'OrderMatched' | 'OrderCancelled';
  signature: string;
  raw: {
    data: string;
    topics: string[];
  };
};

export type OrderCreatedValues = {
  0: bigint;
  1: bigint;
  2: bigint;
  3: string;
  4: string;
  5: string;
  6: boolean;
  __length__: number;
  id: bigint;
  amountA: bigint;
  amountB: bigint;
  tokenA: string;
  tokenB: string;
  user: string;
  isMarket: boolean;
};

export type OrderMatchedValues = {
  0: number;
  1: bigint;
  2: bigint;
  3: bigint;
  4: bigint;
  5: bigint;
  6: bigint;
  __length__: number;
  id: bigint;
  matchedId: bigint;
  amountReceived: bigint;
  amountPaid: bigint;
  amountLeftToFill: bigint;
  fee: bigint;
  feeRate: bigint;
};

export type OrderCancelledValues = {
  0: bigint;
  __length__: number;
  id: bigint;
};
