import type { BrokerAdapter } from "../broker_adapter.ts";
import type { BrokerTransaction } from "../broker_adapter.ts";
import { InformativeError } from "../InformativeError.ts";
import { moneyToNumber } from "../broker_reading.ts";
import { XMLParser } from "fast-xml-parser";
import type { CurrencyCode } from "../enums.ts";

interface IBKRTrade {
  tradeDate: string;
  isin: string;
  currency: CurrencyCode;
  tradeMoney: string;
}

interface IBKRFlexResponse {
  FlexQueryResponse?: {
    FlexStatements?: {
      FlexStatement?: {
        Trades?: {
          Trade?: IBKRTrade[] | IBKRTrade;
        };
      };
    };
  };
}

export const IBKRActivityFlexAdapter: BrokerAdapter = async (data) => {
  const text = await data.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  let json: IBKRFlexResponse;
  try {
    json = parser.parse(text);
  } catch (e) {
    throw new InformativeError("ibkr_activity_flex.xml_parse_error", e);
  }

  // Navigate to Trades.Trade[]
  const rawTrades = json?.FlexQueryResponse?.FlexStatements?.FlexStatement
    ?.Trades?.Trade;
  const trades = Array.isArray(rawTrades)
    ? rawTrades
    : rawTrades
    ? [rawTrades]
    : [];

  if (!Array.isArray(trades)) {
    throw new InformativeError("ibkr_activity_flex.trades_not_found", json);
  }

  const brokerTransactions: BrokerTransaction[] = [];

  for (let i = 0; i < trades.length; i++) {
    const trade: IBKRTrade = trades[i];
    const dateString = trade.tradeDate;

    if (!dateString || dateString.length !== 8) {
      throw new InformativeError("ibkr_activity_flex.invalid_date", trade);
    }

    brokerTransactions.push({
      date: new Date(
        `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${
          dateString.substring(6, 8)
        }`,
      ),
      isin: trade.isin,
      currency: trade.currency,
      value: moneyToNumber(trade.tradeMoney),
    });
  }

  return brokerTransactions;
};
