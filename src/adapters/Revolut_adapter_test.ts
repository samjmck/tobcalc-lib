import { assertEquals } from "@std/assert";
import type { BrokerTransaction } from "../broker_adapter.ts";
import { CurrencyCode } from "../enums.ts";
import { RevolutAdapter } from "./Revolut_adapter.ts";

Deno.test({
  name: "Revolut adapter converting csv to taxable transactions",
  permissions: {
    read: true,
  },
  fn: async () => {
    const data = await Deno.readFile("src/adapters/Revolut_adapter_test.csv");
    const brokerTransactions = await RevolutAdapter(new Blob([data]));

    assertEquals(
      brokerTransactions[0],
      <BrokerTransaction> {
        date: new Date("2025-04-09"),
        isin: "NL0010273215",
        currency: CurrencyCode.EUR,
        value: 4_852_15,
      },
    );
    assertEquals(
      brokerTransactions[1],
      <BrokerTransaction> {
        date: new Date("2025-06-25"),
        isin: "NL0010273215",
        currency: CurrencyCode.EUR,
        value: 5_563_12,
      },
    );


    assertEquals(
      brokerTransactions[2],
      <BrokerTransaction> {
        date: new Date("2025-04-29"),
        isin: "FI4000297767",
        currency: CurrencyCode.EUR,
        value: 3_593_98,
      },
    );
    assertEquals(
      brokerTransactions[3],
      <BrokerTransaction> {
        date: new Date("2025-06-26"),
        isin: "FI4000297767",
        currency: CurrencyCode.EUR,
        value: 3_704_61,
      },
    );

    assertEquals(
      brokerTransactions[4],
      <BrokerTransaction> {
        date: new Date("2025-03-14"),
        isin: "US92826C8394",
        currency: CurrencyCode.EUR,
        value: 2_063_33,
      },
    );
    assertEquals(
      brokerTransactions[5],
      <BrokerTransaction> {
        date: new Date("2025-03-28"),
        isin: "US92826C8394",
        currency: CurrencyCode.EUR,
        value: 2_166_85,
      },
    );


    assertEquals(
      brokerTransactions[6],
      <BrokerTransaction> {
        date: new Date("2025-04-08"),
        isin: "US02079K3059",
        currency: CurrencyCode.EUR,
        value: 4_897_75,
      },
    );
    assertEquals(
      brokerTransactions[7],
      <BrokerTransaction> {
        date: new Date("2025-04-28"),
        isin: "US02079K3059",
        currency: CurrencyCode.EUR,
        value: 5_017_04,
      },
    );



    assertEquals(brokerTransactions.length, 8);
  },
});
