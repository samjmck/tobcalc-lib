## Using tobcalc-lib

### API

Use the automatically generated
[API documentation](https://jsr.io/@samjmck/tobcalc-lib/docs) from JSR to see
the available functions and types.

## Example usage

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
[`example_usage.ts`](/docs/example_usage.ts). At the end of the example file,
there are examples on how you can write the filled in PDF to a file in different
runtimes.
