import {
  fillPdf,
  getDefaultSecuritiesMap,
  getDefaultTaxRate,
  getTaxableTransactions,
  getTaxFormData,
  Trading212Adapter,
} from "../src/export.ts";

// Convert csv data to a Blob
const trading212Csv =
  `Action,Time,ISIN,Ticker,Name,No. of shares,Price / share,Currency (Price / share),Exchange rate,Result (EUR),Total (EUR),Withholding tax,Currency (Withholding tax),ID,Currency conversion fee (EUR)
"Market sell,2021-04-01 16:48:16,IE00BK5BQT80,VWRA,""Vanguard FTSE All-World UCITS ETF (USD) Accumulating"",2,586.32,EUR,1.17733,3.10,53.10,,,EOF1250970797,"
"Market sell,2021-05-03 08:55:46,US78462F1030,SPY,""SPDR® S&P 500® ETF Trust"",1,1083.96,USD,1.00000,0.06,25.06,,,EOF1258940324,"
"Market buy,2021-07-13 14:39:02,IE00B4L5Y983,IWDA,""iShares Core MSCI World UCITS ETF"",1.0000000000,301.22,EUR,1.00000,,65.22,,,EOF1271381371,"`;
const trading212Blob = new Blob([trading212Csv]);

// Get broker transactions by calling adapter on the data
const brokerTransactions = await Trading212Adapter(trading212Blob);
// Convert broker transactions to taxable transactions using the default securities map
const taxableTransactions = await getTaxableTransactions(
  brokerTransactions,
  getDefaultSecuritiesMap,
);
// Convert taxable transactions to tax form data that can be filled into a PDF using the default tax rate
const taxFormData = getTaxFormData(taxableTransactions, getDefaultTaxRate);

// Fill PDF form with tax form data

// You can browse the list of available PDFs here: https://jsr.io/@samjmck/tobcalc-lib/1.0.1/pdfs/build
// Make sure to choose a PDF that ends in "-fillable-pdfa.pdf"
const fillablePdf =
  "https://jsr.io/@samjmck/tobcalc-lib/1.0.1/pdfs/build/TD-OB1-DE-empty-fillable-pdfa.pdf";

// Load the PDF and convert it to a Uint8Array
const fillablePdfResponse = await fetch(fillablePdf);
const fillablePdfData = await fillablePdfResponse.arrayBuffer();
const fillablePdfBytes = new Uint8Array(fillablePdfData);

const pdf = await fillPdf(fillablePdfBytes, {
  start: new Date(),
  end: new Date(),
  nationalRegistrationNumber: "nnr",
  fullName: "Sam Mckenzie",
  addressLine1: "Address line 1",
  addressLine2: "Address line 2",
  addressLine3: "Address line 3",
  tableATax012Quantity: taxFormData["012"].quantity,
  tableATax035Quantity: taxFormData["035"].quantity,
  tableATax132Quantity: taxFormData["132"].quantity,
  tableATax012TaxBase: taxFormData["012"].taxBase,
  tableATax035TaxBase: taxFormData["035"].taxBase,
  tableATax132TaxBase: taxFormData["132"].taxBase,
  tableATax012TaxValue: taxFormData["012"].taxValue,
  tableATax035TaxValue: taxFormData["035"].taxValue,
  tableATax132TaxValue: taxFormData["132"].taxValue,
  tableATotalTaxValue: taxFormData["total"],
  totalTaxValue: taxFormData["total"],
  signaturePng: null,
  signatureName: "Sam Mckenzie",
  signatureCapacity: "",
  location: "Antwerp",
  date: "01/01/2024",
});

// Deno
// await Deno.writeFile("test.pdf", pdf);

// Bun
// await Bun.writeFile("test.pdf", pdf);

// Node
// import { writeFile } from "fs/promises";
// await writeFile("test.pdf", pdf);
