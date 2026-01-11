import { IBKRAdapter } from "./IBKR_adapter.ts";
import { assertEquals } from "@std/assert";
import { CurrencyCode } from "../enums.ts";
import { assertTransactionEquals } from "./adapter_test_helper.ts";

Deno.test({
  name: "IBKR adapter converting csv to taxable transactions",
  permissions: {
    read: true,
  },
  fn: async () => {
    const data = await Deno.readFile("src/adapters/IBKR_adapter_test.csv");
    const brokerTransactions = await IBKRAdapter(new Blob([data]));

    assertTransactionEquals(
      brokerTransactions[0],
      {
        date: new Date("2022-02-02"),
        isin: "IE00B4L5Y983",
        currency: CurrencyCode.EUR,
        value: -357_36,
      },
    );
    assertTransactionEquals(
      brokerTransactions[1],
      {
        date: new Date("2022-02-02"),
        isin: "IE00B4L5Y983",
        currency: CurrencyCode.EUR,
        value: -357_36,
      },
    );
    assertTransactionEquals(
      brokerTransactions[2],
      {
        date: new Date("2022-02-02"),
        isin: "IE00BK5BQT80",
        currency: CurrencyCode.EUR,
        value: -791_75,
      },
    );
    assertTransactionEquals(
      brokerTransactions[3],
      {
        date: new Date("2022-02-02"),
        isin: "IE00BFY0GT14",
        currency: CurrencyCode.EUR,
        value: -1305_57,
      },
    );
    assertTransactionEquals(
      brokerTransactions[4],
      {
        date: new Date("2022-02-02"),
        isin: "US0378331005",
        currency: CurrencyCode.USD,
        value: -1381_75,
      },
    );
    assertTransactionEquals(
      brokerTransactions[5],
      {
        date: new Date("2022-02-02"),
        isin: "IE00BFY0GT14",
        currency: CurrencyCode.EUR,
        value: -303_11,
      },
    );
    assertTransactionEquals(
      brokerTransactions[6],
      {
        date: new Date("2022-02-02"),
        isin: "IE00BFY0GT14",
        currency: CurrencyCode.EUR,
        value: -303_10,
      },
    );
    assertEquals(brokerTransactions.length, 7);
  },
});

Deno.test({
  name: "IBKR adapter works with file that uses \r\n line breaks",
  permissions: {
    read: true,
  },
  fn: async () => {
    const data = await Deno.readFile("src/adapters/IBKR_adapter_test.csv");
    const blob = new Blob([data]);
    const text = await blob.text();
    // Make file use \r\n line breaks
    const modifiedText = text.replace(/\n/g, "\r\n");
    const brokerTransactions = await IBKRAdapter(new Blob([modifiedText]));
    assertEquals(brokerTransactions.length, 7);
  },
});
