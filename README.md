# tobcalc-lib

A library to calculate the Belgian tax on stock-exchange transactions for
foreign brokers and fill in declaration PDF with details. It is the core library
used in the [tobcalc website](https://github.com/samjmck/tobcalc).

## Table of contents

1. [Installation](#installation)
2. [Documentation](#documentation)
   1. [Usage](docs/usage.md)
   2. [Contributing](docs/contributing.md)
3. [Example](#example)

## Installation

The library is published as a package on JSR under
[@samjmck/tobcalc-lib](https://jsr.io/@samjmck/tobcalc-lib). It supports Deno,
Node and the browser.

**Deno**

```
deno add @samjmck/tobcalc-lib
```

**Node (npm)**

```
npx jsr add @samjmck/tobcalc-lib
```

**Bun**

```
bunx jsr add @samjmck/tobcalc-lib
```

## Documentation

If you are using the library, look at the [usage documentation](docs/usage.md).

If you would like to contribute, look at the
[contributing documentation](docs/contributing.md).

If you would like to test your changes in a frontend environment or elsewhere,
look at the [frontend testing documentation](docs/frontend_testing.md).

## Example

1. Parse the broker transactions from a CSV file using the appropriate adapter.
2. Convert the broker transactions to taxable transactions.
3. Convert the taxable transactions to tax form data that can be filled into a
   PDF.
4. Fill in the PDF with the tax form data.

```ts
// Step 1: Parse the broker transactions from a CSV file using the appropriate adapter
// trading212Csv is a string containing the CSV data from Trading212
const brokerTransactions = await Trading212Adapter(new Blob([trading212Blob]));
// Step 2: Convert broker transactions to taxable transactions using the default securities map
const taxableTransactions = await getTaxableTransactions(brokerTransactions, getDefaultSecuritiesMap);
// Step 3: Convert taxable transactions to tax form data that can be filled into a PDF using the default tax rate
const taxFormData = getTaxFormData(taxableTransactions, getDefaultTaxRate);
// Step 4: Fill in the PDF with the tax form data
const pdfBytes = await fillPdf(fillablePdfBytes, {
	...
	tableATax012Quantity: taxFormData["012"].quantity,
	tableATax035Quantity: taxFormData["035"].quantity,
	tableATax132Quantity: taxFormData["132"].quantity,
	...
});
```

All necessary functions and variables are exported from the root of the library.
A more complete example can be found in
[`examples/example_usage.ts`](/docs/example_usage.ts). At the end of the example
file, there are examples on how you can write the filled in PDF to a file in
different runtimes.
