import { assertAlmostEquals, assertEquals } from "@std/assert";
import type { BrokerTransaction } from "../broker_adapter.ts";

export function assertTransactionEquals(
  actual: BrokerTransaction,
  expected: BrokerTransaction,
) {
  assertEquals(actual.date, expected.date);
  assertEquals(actual.isin, expected.isin);
  assertEquals(actual.currency, expected.currency);
  assertAlmostEquals(actual.value, expected.value);
}
