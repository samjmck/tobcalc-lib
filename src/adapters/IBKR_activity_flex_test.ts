import { assertEquals } from "@std/assert";
import type { BrokerTransaction } from "../broker_adapter.ts";
import { CurrencyCode } from "../enums.ts";
import { IBKRActivityFlexAdapter } from "./IBKR_activity_flex.ts";

Deno.test({
  name:
    "IBKRActivityFlexAdapter parses XML to BrokerTransaction[] (all trades)",
  permissions: { read: true },
  fn: async () => {
    const data = await Deno.readFile(
      "src/adapters/IBKR_activity_flex_test.xml",
    );
    const brokerTransactions = await IBKRActivityFlexAdapter(new Blob([data]));

    const expected: BrokerTransaction[] = [
      {
        date: new Date("2025-02-03"),
        isin: "ISIN_1",
        currency: CurrencyCode.EUR,
        value: 140891,
      },
      {
        date: new Date("2025-03-25"),
        isin: "ISIN_2",
        currency: CurrencyCode.EUR,
        value: 2949,
      },
      {
        date: new Date("2025-03-25"),
        isin: "ISIN_3",
        currency: CurrencyCode.EUR,
        value: 81092,
      },
      {
        date: new Date("2025-04-04"),
        isin: "ISIN_4",
        currency: CurrencyCode.EUR,
        value: 147303,
      },
      {
        date: new Date("2025-04-04"),
        isin: "ISIN_5",
        currency: CurrencyCode.EUR,
        value: 2697,
      },
      {
        date: new Date("2025-04-04"),
        isin: "ISIN_6",
        currency: CurrencyCode.EUR,
        value: 145000,
      },
      {
        date: new Date("2025-04-04"),
        isin: "ISIN_7",
        currency: CurrencyCode.EUR,
        value: -124705,
      },
      {
        date: new Date("2025-04-04"),
        isin: "ISIN_8",
        currency: CurrencyCode.EUR,
        value: 32818,
      },
      {
        date: new Date("2025-05-02"),
        isin: "ISIN_9",
        currency: CurrencyCode.EUR,
        value: 148000,
      },
      {
        date: new Date("2025-06-02"),
        isin: "ISIN_10",
        currency: CurrencyCode.EUR,
        value: 148000,
      },
    ];

    assertEquals(brokerTransactions.length, expected.length);
    for (let i = 0; i < expected.length; i++) {
      assertEquals(brokerTransactions[i], expected[i]);
    }
  },
});
