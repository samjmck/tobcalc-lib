import { assertEquals } from "@std/assert";
import { CurrencyCode } from "../enums.ts";
import { RevolutAdapter } from "./Revolut_adapter.ts";
import { assertTransactionEquals } from "./adapter_test_helper.ts";

Deno.test({
  name: "Revolut adapter converting csv to taxable transactions",
  permissions: {
    read: true,
  },
  fn: async () => {
    const data = await Deno.readFile("src/adapters/Revolut_adapter_test.csv");
    const brokerTransactions = await RevolutAdapter(new Blob([data]));

    assertTransactionEquals(
      brokerTransactions[0],
      {
        date: new Date("2025-03-14"),
        isin: "US92826C8394",
        currency: CurrencyCode.USD,
        value: -2244_39,
      },
    );
    assertTransactionEquals(
      brokerTransactions[1],
      {
        date: new Date("2025-03-28"),
        isin: "US92826C8394",
        currency: CurrencyCode.USD,
        value: 2345_98,
      },
    );

    assertTransactionEquals(
      brokerTransactions[2],
      {
        date: new Date("2025-04-08"),
        isin: "US02079K3059",
        currency: CurrencyCode.USD,
        value: -5376_56,
      },
    );
    assertTransactionEquals(
      brokerTransactions[3],
      {
        date: new Date("2025-04-28"),
        isin: "US02079K3059",
        currency: CurrencyCode.USD,
        value: 5723_44,
      },
    );

    assertTransactionEquals(
      brokerTransactions[4],
      {
        date: new Date("2025-04-09"),
        isin: "NL0010273215",
        currency: CurrencyCode.EUR,
        value: -4852_15,
      },
    );
    assertTransactionEquals(
      brokerTransactions[5],
      {
        date: new Date("2025-06-25"),
        isin: "NL0010273215",
        currency: CurrencyCode.EUR,
        value: 5563_12,
      },
    );

    assertTransactionEquals(
      brokerTransactions[6],
      {
        date: new Date("2025-04-29"),
        isin: "FI4000297767",
        currency: CurrencyCode.EUR,
        value: -3593_98,
      },
    );
    assertTransactionEquals(
      brokerTransactions[7],
      {
        date: new Date("2025-06-26"),
        isin: "FI4000297767",
        currency: CurrencyCode.EUR,
        value: 370461,
      },
    );

    assertEquals(brokerTransactions.length, 8);
  },
});
