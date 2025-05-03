import { parseArgs } from "@std/cli/parse-args";
import type { BrokerAdapter } from "../src/broker_adapter.ts";
import { BoursoramaAdapter } from "../src/adapters/Boursorama_adapter.ts";
import { DEGIROAdapter } from "../src/adapters/DEGIRO_adapter.ts";
import { IBKRAdapter } from "../src/adapters/IBKR_adapter.ts";
import { Trading212Adapter } from "../src/adapters/Trading212_adapter.ts";
import {
  getDefaultTaxRate,
  getTaxableTransactions,
  getTaxFormData,
} from "../src/tax.ts";
import { getSecurity } from "../src/data.ts";
import { type Security, SecurityType } from "../src/enums.ts";

const args = parseArgs(Deno.args, { collect: ["etf"] });

if (args._.length === 0) {
  console.error("No file path provided");
  Deno.exit(1);
}

const filePath = <string> args._[0];
const file = await Deno.readFile(filePath);
const blob = new Blob([file]);

let adapter: BrokerAdapter;
if (args.type == "boursorama") {
  adapter = BoursoramaAdapter;
} else if (args.type == "degiro") {
  adapter = DEGIROAdapter;
} else if (args.type == "ibkr") {
  adapter = IBKRAdapter;
} else if (args.type == "trading212") {
  adapter = Trading212Adapter;
} else {
  console.error("Invalid broker type");
  Deno.exit(1);
}

const brokerTransactions = await adapter(blob);
console.log("Got broker transactions");
console.log(brokerTransactions);

const hardcodedSecuritiesMap = new Map<string, Security>();

if (args.etf) {
  for (const etf of args.etf) {
    const etfString = <string> etf;
    hardcodedSecuritiesMap.set(etfString, {
      isin: etfString,
      name: "",
      type: SecurityType.ETF,
      accumulating: true,
    });
  }
}

async function getSecuritiesMap(
  isins: string[],
): Promise<Map<string, Security>> {
  const securitiesMap = new Map<string, Security>();
  for (const isin of isins) {
    if (hardcodedSecuritiesMap.has(isin)) {
      securitiesMap.set(isin, <Security> hardcodedSecuritiesMap.get(isin));
    } else {
      securitiesMap.set(isin, await getSecurity(isin));
    }
  }
  return Promise.resolve(securitiesMap);
}

const taxableTransactions = await getTaxableTransactions(
  brokerTransactions,
  getSecuritiesMap,
);
console.log("Got taxable transactions");
console.log(taxableTransactions);

const taxFormData = getTaxFormData(taxableTransactions, getDefaultTaxRate);
console.log("Got tax form data");
console.log(taxFormData);
