import { assertEquals } from "@std/assert";
import { CurrencyCode } from "../enums.ts";
import { DEGIROAdapter } from "./DEGIRO_adapter.ts";
import { assertTransactionEquals } from "./adapter_test_helper.ts";

Deno.test({
  name: "DEGIRO adapter converting csv to taxable transactions",
  permissions: {
    read: true,
  },
  fn: async () => {
    const data = await Deno.readFile("src/adapters/DEGIRO_adapter_test.csv");
    const brokerTransactions = await DEGIROAdapter(new Blob([data]));

    assertTransactionEquals(
      brokerTransactions[0],
      {
        date: new Date("2021-12-03"),
        isin: "IE00B1XNHC34",
        currency: CurrencyCode.EUR,
        value: 203_83,
      },
    );
    assertTransactionEquals(
      brokerTransactions[1],
      {
        date: new Date("2021-11-17"),
        isin: "GB00BL9YR756",
        currency: CurrencyCode.GBX,
        value: -42968_00,
      },
    );
    assertTransactionEquals(
      brokerTransactions[2],
      {
        date: new Date("2021-11-12"),
        isin: "US18915M1071",
        currency: CurrencyCode.USD,
        value: 910_00,
      },
    );
    assertTransactionEquals(
      brokerTransactions[3],
      {
        date: new Date("2021-04-03"),
        isin: "IE00BK5BQT80",
        currency: CurrencyCode.EUR,
        value: -2148_52,
      },
    );
    assertEquals(brokerTransactions.length, 4);
  },
});
