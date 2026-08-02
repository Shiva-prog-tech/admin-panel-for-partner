// ===========================================================================
// USD float — owned by FloatModule.
//
// Covers the journal listing plus the two write operations behind
// "Convert custody → USD float": quote, then settle.
// ===========================================================================
import http from "@/utils/axios";
import { Config } from "@/utils/Config";
import { fetchList, exportUrl, type ListQuery } from "@/services/list";
import { journalEntries } from "@/mockData/floatLedger";
import { floatSummary } from "@/mockData/dashboard";
import type { FloatSummary, Paginated } from "@/types/global";
import type { ConvertQuote, JournalEntry } from "../types";

export interface ConvertRequest {
  asset: string;
  chain: string;
  amount: number;
}

/** Indicative rates used while mock mode is on. */
const MOCK_RATES: Record<string, number> = {
  BTC: 64213.5,
  ETH: 3184.2,
  USDT: 1,
  USDC: 1,
  TRX: 0.1324,
  MATIC: 0.5871,
};

const WITHDRAWAL_BPS = 25;

export const floatService = {
  async summary(): Promise<FloatSummary> {
    if (Config.features.mockData) return floatSummary;
    const { data } = await http.get<FloatSummary>("/float");
    return data;
  },

  journal: (query: ListQuery = {}): Promise<Paginated<JournalEntry>> =>
    fetchList<JournalEntry>("/float/journal", journalEntries, query),

  /** Prices a custody → float settlement without committing it. */
  async quote({ asset, chain, amount }: ConvertRequest): Promise<ConvertQuote> {
    if (Config.features.mockData) {
      const rate = MOCK_RATES[asset] ?? 1;
      const usd = Number((amount * rate).toFixed(2));
      const feeUsd = Number(((usd * WITHDRAWAL_BPS) / 10_000).toFixed(2));
      return {
        asset,
        chain,
        amount,
        rate,
        usd,
        feeUsd,
        netUsd: Number((usd - feeUsd).toFixed(2)),
      };
    }
    const { data } = await http.get<ConvertQuote>("/float/quote", {
      params: { asset, chain, amount },
    });
    return data;
  },

  /** Commits the settlement priced by `quote`. */
  async settle(request: ConvertRequest): Promise<{ reference: string }> {
    if (Config.features.mockData) {
      return { reference: `settle_${request.asset}_${request.chain}` };
    }
    const { data } = await http.post<{ reference: string }>("/float/settle", request);
    return data;
  },

  exportCsv: (query: ListQuery = {}) => exportUrl("float/journal", query),
};

export default floatService;
