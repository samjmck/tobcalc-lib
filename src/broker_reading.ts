/**
 * Parses a `money` string into a number
 * @param {string} money The string that is being parsed
 * @param {string} [decimalSeparator=.] The string or character that is used to separate decimals from the whole number
 * @param {number|null} [decimalCount=2] The number of decimals in the `money` parameter. All decimals up to that number
 * of decimals will be part of the whole number. e.g. `1.23` with `decimalCount=2` would return `123`. `null` means
 * the decimal count is determined by number of characters after the decimal separator in the money string.
 */
export function moneyToNumber(
  money: string,
  decimalSeparator = ".",
  decimalCount: number | null = 2,
) {
  const decimalSeparatorIndex = money.indexOf(decimalSeparator);

  let decimalsFound: number;
  if (decimalSeparatorIndex === -1) {
    decimalsFound = 0;
  } else {
    decimalsFound = money.length - decimalSeparatorIndex - 1;
  }

  // Auto-detect expected decimals by looking at the number of numbers behind the
  // decimal separator. If there is no decimal separator, then expect the number
  // of decimals to be 0
  let exponent: number;
  if (decimalCount === null) {
    exponent = decimalsFound;
  } else {
    exponent = decimalCount - decimalsFound;
  }

  return Number(money.replace(decimalSeparator, "")) *
    (10 ** exponent);
}
