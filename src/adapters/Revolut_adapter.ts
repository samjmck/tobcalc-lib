import type { CurrencyCode } from "../enums.ts";
import type { BrokerAdapter, BrokerTransaction } from "../broker_adapter.ts";
import { InformativeError } from "../InformativeError.ts";
import { moneyToNumber } from "../broker_reading.ts";

export const RevolutAdapter: BrokerAdapter = async (data) => {
  const brokerTransactions: BrokerTransaction[] = [];
  
  

  return brokerTransactions;
};
