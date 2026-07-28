// ===========================================================================
// Supported crypto assets — display metadata for balances and tx lists
// ===========================================================================

export type CoinKey = "usdt" | "usdc" | "trx" | "btc" | "eth" | "generic";

export interface CoinMeta {
  key: CoinKey;
  symbol: string;
  name: string;
  glyph: string;
  decimals: number;
  networks: string[];
}

export const COINS: Record<CoinKey, CoinMeta> = {
  usdt: {
    key: "usdt",
    symbol: "USDT",
    name: "Tether USD",
    glyph: "₮",
    decimals: 6,
    networks: ["TRON", "Ethereum", "BSC"],
  },
  usdc: {
    key: "usdc",
    symbol: "USDC",
    name: "USD Coin",
    glyph: "$",
    decimals: 6,
    networks: ["Ethereum", "Polygon", "Base"],
  },
  trx: {
    key: "trx",
    symbol: "TRX",
    name: "Tron",
    glyph: "T",
    decimals: 6,
    networks: ["TRON"],
  },
  btc: {
    key: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    glyph: "₿",
    decimals: 8,
    networks: ["Bitcoin"],
  },
  eth: {
    key: "eth",
    symbol: "ETH",
    name: "Ethereum",
    glyph: "Ξ",
    decimals: 18,
    networks: ["Ethereum", "Base", "Arbitrum"],
  },
  generic: {
    key: "generic",
    symbol: "—",
    name: "Asset",
    glyph: "•",
    decimals: 2,
    networks: [],
  },
};

export function coinKeyOf(symbol: string): CoinKey {
  const key = symbol.trim().toLowerCase() as CoinKey;
  return key in COINS ? key : "generic";
}

export function coinMeta(symbol: string): CoinMeta {
  return COINS[coinKeyOf(symbol)];
}

export const EXPLORERS: Record<string, string> = {
  TRON: "https://tronscan.org/#/transaction/",
  Ethereum: "https://etherscan.io/tx/",
  BSC: "https://bscscan.com/tx/",
  Polygon: "https://polygonscan.com/tx/",
  Base: "https://basescan.org/tx/",
  Bitcoin: "https://mempool.space/tx/",
};

export function explorerLink(network: string, hash: string): string | null {
  const base = EXPLORERS[network];
  return base ? `${base}${hash}` : null;
}
