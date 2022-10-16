import CoinGeckoApi from 'coingecko-api';

const coinGeckoClient = new CoinGeckoApi();

export class CoinGecko {
  public readonly getRate = async (coinId: string, currency: string) => {
    const priceRes = await coinGeckoClient.simple.price({ ids: coinId, vs_currencies: currency });

    if (priceRes.success) return priceRes.data?.[coinId]?.[currency];

    throw new Error(priceRes.message);
  };
}
