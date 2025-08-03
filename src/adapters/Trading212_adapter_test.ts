import { CurrencyCode } from "../enums.ts";
import { Trading212Adapter } from "./Trading212_adapter.ts";
import { assertTransactionEquals } from "./adapter_test_helper.ts";

Deno.test({
  name: "Trading212 adapter converting csv to taxable transactions",
  permissions: {
    read: true,
  },
  fn: async () => {
    const data = await Deno.readFile(
      "src/adapters/Trading212_adapter_test.csv",
    );
    const brokerTransactions = await Trading212Adapter(new Blob([data]));

    assertTransactionEquals(
      brokerTransactions[0],
      {
        date: new Date("2021-04-01"),
        isin: "IE00BK5BQT80",
        currency: CurrencyCode.EUR,
        value: 1172_64,
      },
    );
    assertTransactionEquals(
      brokerTransactions[1],
      {
        date: new Date("2021-05-03"),
        isin: "US78462F1030",
        currency: CurrencyCode.USD,
        value: 1083_96,
      },
    );
    assertTransactionEquals(
      brokerTransactions[2],
      {
        date: new Date("2021-07-13"),
        isin: "IE00B4L5Y983",
        currency: CurrencyCode.EUR,
        value: -301_22,
      },
    );
    assertTransactionEquals(
      brokerTransactions[3],
      {
        date: new Date("2021-07-13"),
        isin: "IE00B0M63177",
        currency: CurrencyCode.EUR,
        value: 483_74,
      },
    );
    assertTransactionEquals(
      brokerTransactions[4],
      {
        date: new Date("2021-08-16"),
        isin: "US4781601046",
        currency: CurrencyCode.USD,
        value: -301_55,
      },
    );
    assertTransactionEquals(
      brokerTransactions[5],
      {
        date: new Date("2021-09-02"),
        isin: "BE0003717312",
        currency: CurrencyCode.EUR,
        value: 205_31,
      },
    );
  },
});
