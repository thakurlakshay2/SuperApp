import axios from "axios";
import { NextResponse } from "next/server";

export interface CoinGeckoAPI {
  usd: number;
  usd_market_cap: number;
  usd_24h_change: number;
}
export interface OneInchInterface extends Partial<CoinGeckoAPI> {
  address: string;
  chainId: 8453;
  decimals: 18;
  eip2612: false;
  isFoT: false;
  logoURI: string;
  name: string;
  providers: string[];
  symbol: string;
  tags: string[];
}

const CURRENCY = "usd";
export async function GET() {
  const response = await axios.get<OneInchInterface[]>(
    "https://api.1inch.dev/token/v1.2/8453",
    {
      headers: {
        Authorization: "Bearer XvuM4bVHatJL9dIBZuSAiFokoJMvVLmf",
        "Content-Type": "application/json",
        accept: "application/json",
      },
      method: "get",
    }
  );

  const data: OneInchInterface[] = [];

  for (const prop in response.data) {
    data.push(response.data[prop]);
  }
  const stringParam = await data
    .map((addressData) => addressData.address)
    .join(",");

  const coinResponse = await axios.get<Record<string, CoinGeckoAPI>>(
    `https://api.coingecko.com/api/v3/simple/token_price/base?contract_addresses=${stringParam}&vs_currencies=${CURRENCY}&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&precision=full`,
    {
      headers: {
        "x-cg-demo-api-key": "CG-2hv8ZWR656Enzs42wBj6JVJW	",
        accept: "application/json",
      },
      method: "get",
    }
  );
  const modifiedMergedData = data
    .map((addressData) => {
      const address = addressData.address;
      const coinPriceInfo = coinResponse.data[address];
      if (coinPriceInfo?.usd) return { ...addressData, ...coinPriceInfo };
    })
    .filter((data) => data != undefined);

  return NextResponse.json(modifiedMergedData);
}
