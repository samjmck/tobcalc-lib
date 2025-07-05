import type { CurrencyCode } from "../enums.ts";
import type { BrokerAdapter, BrokerTransaction } from "../broker_adapter.ts";

export const RevolutAdapter: BrokerAdapter = async (data) => {
  const text = await data.text();
  const brokerTransactions: BrokerTransaction[] = [];

  // Helper to clean and convert euro values to cents
  function parseEuroToCents(val: string): number {
    // Remove euro sign encoding issues and commas, then parse
    let cleaned = val.replace(/â¬|€/g, '').replace(/,/g, '').trim();
    // Only take the part before a space if present (e.g. "4,852.15 EUR")
    cleaned = cleaned.split(' ')[0];
    // If value is empty, return 0
    if (!cleaned) return 0;
    return Math.round(parseFloat(cleaned) * 100);
  }

  // Find all 'Transactions for Brokerage Account sells' sections
  const lines = text.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    if (lines[i].startsWith('Transactions for Brokerage Account sells')) {
      // Skip header lines until we find the column header
      while (i < lines.length && !lines[i].startsWith('Date acquired')) i++;
      if (i >= lines.length) break;
      const header = lines[i].split(',');
      const idxDateAcquired = header.indexOf('Date acquired');
      const idxDateSold = header.indexOf('Date sold');
      const idxISIN = header.indexOf('ISIN');
      const idxCostBasisBase = header.indexOf('Cost basis base currency');
      const idxGrossProceedsBase = header.indexOf('Gross proceeds base currency');
      i++;
      // Parse rows until an empty line or next section
      while (i < lines.length && lines[i].trim() && !lines[i].startsWith('Transactions')) {
        // Split CSV line, ignoring commas within quotes
        const row = [];
        let current = '';
        let inQuotes = false;
        for (let charIdx = 0; charIdx < lines[i].length; charIdx++) {
          const char = lines[i][charIdx];
          if (char === '"') {
            inQuotes = !inQuotes;
            current += char;
          } else if (char === ',' && !inQuotes) {
            row.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        row.push(current);
        if (row.length < Math.max(idxDateAcquired, idxDateSold, idxISIN, idxCostBasisBase, idxGrossProceedsBase) + 1) {
          i++;
          continue;
        }
        // Remove quotes
        const dateAcquired = row[idxDateAcquired].replace(/"/g, '').trim();
        const dateSold = row[idxDateSold].replace(/"/g, '').trim();
        const isin = row[idxISIN].replace(/"/g, '').trim();
        const costBasisBase = row[idxCostBasisBase].replace(/"/g, '').trim();
        const grossProceedsBase = row[idxGrossProceedsBase].replace(/"/g, '').trim();
        // Only process if ISIN and values are present
        if (isin && costBasisBase && grossProceedsBase && dateAcquired && dateSold) {
          // Only use EUR values from the 'Cost basis base currency' and 'Gross proceeds base currency' columns
          // These columns may contain values like 'â¬4,852.15' or 'US$5,376.56'. Only process if value starts with euro sign encoding
          if (/^â¬|^€/ .test(costBasisBase)) {
            brokerTransactions.push({
              date: new Date(
                dateAcquired.replace(/(\w+) (\d+), (\d{4})/, (_m, m1, m2, m3) => `${m3}-${("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(m1.substr(0,3)) / 3 + 1).toString().padStart(2, '0')}-${m2.padStart(2, '0')}`)
              ),
              isin,
              currency: 'EUR' as CurrencyCode,
              value: parseEuroToCents(costBasisBase),
            });
          }
          if (/^â¬|^€/ .test(grossProceedsBase)) {
            brokerTransactions.push({
              date: new Date(
                dateSold.replace(/(\w+) (\d+), (\d{4})/, (_m, m1, m2, m3) => `${m3}-${("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(m1.substr(0,3)) / 3 + 1).toString().padStart(2, '0')}-${m2.padStart(2, '0')}`)
              ),
              isin,
              currency: 'EUR' as CurrencyCode,
              value: parseEuroToCents(grossProceedsBase),
            });
          }
        }
        i++;
      }
    } else {
      i++;
    }
  }

  return brokerTransactions;
};
