import type { CurrencyCode } from "../enums.ts";
import type { BrokerAdapter, BrokerTransaction } from "../broker_adapter.ts";

export const RevolutAdapter: BrokerAdapter = async (data) => {
  const text = await data.text();
  const brokerTransactions: BrokerTransaction[] = [];

  // Helper to clean and convert values to cents
  function parseToCents(val: string): number {
    const num = parseFloat(val);
    return Math.round(num * 100);
  }

  const lines = text.split(/\r?\n/);
  let i = 0;

  // Find "Income from Sells" section
  while (i < lines.length && !lines[i].startsWith("Income from Sells")) {
    i++;
  }

  // Skip "Income from Sells" line
  if (i < lines.length) {
    i++;
  }

  // Header line
  if (i < lines.length && lines[i].startsWith("Date acquired")) {
    const header = lines[i].split(",");
    const idxDateAcquired = header.indexOf("Date acquired");
    const idxDateSold = header.indexOf("Date sold");
    const idxISIN = header.indexOf("ISIN");
    const idxCostBasis = header.indexOf("Cost basis");
    const idxGrossProceeds = header.indexOf("Gross proceeds");
    const idxCurrency = header.indexOf("Currency");
    i++;

    // Data rows
    while (i < lines.length && lines[i].trim()) {
      // Stop if we reach the next section
      if (lines[i].startsWith("Other income & fees")) {
        break;
      }

      const row = lines[i].split(",");

      if (
        row.length <
          Math.max(
            idxDateAcquired,
            idxDateSold,
            idxISIN,
            idxCostBasis,
            idxGrossProceeds,
            idxCurrency,
          ) + 1
      ) {
        i++;
        continue;
      }

      const dateAcquired = row[idxDateAcquired].trim();
      const dateSold = row[idxDateSold].trim();
      const isin = row[idxISIN].trim();
      const costBasis = row[idxCostBasis].trim();
      const grossProceeds = row[idxGrossProceeds].trim();
      const currency = row[idxCurrency].trim() as CurrencyCode;

      if (
        isin && costBasis && grossProceeds && dateAcquired && dateSold &&
        currency
      ) {
        brokerTransactions.push({
          date: new Date(dateAcquired),
          isin,
          currency,
          value: parseToCents(costBasis),
        });
        brokerTransactions.push({
          date: new Date(dateSold),
          isin,
          currency,
          value: parseToCents(grossProceeds),
        });
      }
      i++;
    }
  }

  return brokerTransactions;
};
