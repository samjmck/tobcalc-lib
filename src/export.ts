import { IBKRAdapter } from "./adapters/IBKR_adapter.ts";
import { DEGIROAdapter } from "./adapters/DEGIRO_adapter.ts";
import { RevolutAdapter } from "./adapters/Revolut_adapter.ts";
import { Trading212Adapter } from "./adapters/Trading212_adapter.ts";
import { BoursoramaAdapter } from "./adapters/Boursorama_adapter.ts";
import { IBKRActivityFlexAdapter } from "./adapters/IBKR_activity_flex_adapter.ts";
import type { BrokerAdapter, BrokerTransaction } from "./broker_adapter.ts";
import { InformativeError } from "./InformativeError.ts";
import {
  exchangeRatesMap,
  getCurrencyExchangeRatesMap,
  getDefaultSecuritiesMap,
  getExchangeRatesMap,
  getSecurity,
  setECBUrlStart,
  setJustETFUrlStart,
  setYahooFinanceQuery1UrlStart,
} from "./data.ts";
import {
  type FormRow,
  getDefaultTaxRate,
  getTaxableTransactions,
  getTaxFormData,
  type TaxableTransaction,
  type TaxFormData,
  type TaxRateFunction,
} from "./tax.ts";
import { isNameRegistered } from "./tax.ts";
import {
  CountryCode,
  CurrencyCode,
  eeaCountries,
  type ETF,
  type Security,
  SecurityType,
  type Stock,
  TransactionType,
} from "./enums.ts";
import { formatMoney } from "./formatting.ts";
import { fillPdf } from "./pdf.ts";
import { workerMessageEventListener } from "./worker.ts";

// Re-export functions that would be used in a webapp
export {
  BoursoramaAdapter,
  CountryCode,
  CurrencyCode,
  DEGIROAdapter,
  eeaCountries,
  exchangeRatesMap,
  fillPdf,
  formatMoney,
  getCurrencyExchangeRatesMap,
  getDefaultSecuritiesMap,
  getDefaultTaxRate,
  getExchangeRatesMap,
  getSecurity,
  getTaxableTransactions,
  getTaxFormData,
  IBKRActivityFlexAdapter,
  IBKRAdapter,
  InformativeError,
  isNameRegistered,
  RevolutAdapter,
  SecurityType,
  setECBUrlStart,
  setJustETFUrlStart,
  setYahooFinanceQuery1UrlStart,
  Trading212Adapter,
  TransactionType,
  workerMessageEventListener,
};

export type {
  BrokerAdapter,
  BrokerTransaction,
  ETF,
  FormRow,
  Security,
  Stock,
  TaxableTransaction,
  TaxFormData,
  TaxRateFunction,
};
