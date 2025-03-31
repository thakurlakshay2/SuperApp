export interface CoinData {
  _id: string;
  id: string;
  name: string;
  symbol: string;
  platforms: {
    ethereum: string;
    polkadot: string;
    "optimistic-ethereum": string;
    stellar: string;
    "near-protocol": string;
    "hedera-hashgraph": string;
    zksync: string;
    avalanche: string;
    base: string;
    "arbitrum-one": string;
    "polygon-pos": string;
    tron: string;
    algorand: string;
    solana: string;
    flow: string;
    celo: string;
  };
  priceUSD: number;
  icon: string;
  marketCap: number;
  percentChange: number;
  priceChange: number;
  tvl: number;
  fetchedAt: string;
  sparkline_price_in_7d: number[];
}
