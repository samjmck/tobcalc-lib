import { BrokerAdapter } from "../broker_adapter.ts";
import type { BrokerTransaction } from "../broker_adapter.ts";
import { InformativeError } from "../InformativeError.ts";
import { moneyToNumber } from "../broker_reading.ts";
import { XMLParser } from "fast-xml-parser";

export const IBKRActivityFlexAdapter: BrokerAdapter = async (data) => {
  const text = await data.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  let json;
  try {
    json = parser.parse(text);
  } catch (e) {
    throw new InformativeError("ibkr_activity_flex.xml_parse_error", e);
  }

  // Navigate to Trades.Trade[]
  const trades =
    json?.FlexQueryResponse?.FlexStatements?.FlexStatement?.Trades?.Trade || [];
  if (!Array.isArray(trades)) {
    throw new InformativeError("ibkr_activity_flex.trades_not_found", json);
  }

  const brokerTransactions: BrokerTransaction[] = trades.map((trade: any) => {
    // tradeDate is in format YYYYMMDD
    const dateString = trade.tradeDate;
    if (!dateString || dateString.length !== 8) {
      throw new InformativeError("ibkr_activity_flex.invalid_date", trade);
    }
    return {
      date: new Date(
        `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${
          dateString.substring(6, 8)
        }`,
      ),
      isin: trade.isin,
      currency: trade.currency,
      value: moneyToNumber(trade.tradeMoney),
    };
  });

  return brokerTransactions;
};
