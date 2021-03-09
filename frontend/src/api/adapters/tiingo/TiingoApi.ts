import {PriceHistoryItem} from '../../../interfaces/ApplicationInterfaces'
import {PriceAdapterInterface} from '../../AdapterInterfaces'

interface TiingoApiPriceResponse {
    date: Date;
    close: number;
    high: number;
    low: number;
    open: number;
    volume: number;
    adjClose: number;
    adjHigh: number;
    adjLow: number;
    adjOpen: number;
    adjVolume: number;
    divCash: number;
    splitFactor: number;
}

export class TiingoApiAdapter implements PriceAdapterInterface {

  async loadPricesFromApi (ticker: string): Promise<TiingoApiPriceResponse[]> {
    console.log(ticker)
    const response = await fetch('./tiingo.json')
    return response.json()
  }

  resolvePriceApiResponse<T> (json: T[]): PriceHistoryItem[] {
    const priceHistoryItems: PriceHistoryItem[] = []

    json.forEach(item => {
      const priceHistoryItem: PriceHistoryItem = {
        close       : item.close,
        date        : item.date,
        divCash     : item.divCash,
        high        : item.high,
        low         : item.low,
        open        : item.open,
        splitFactor : item.splitFactor,
        volume      : item.volume
      }
      priceHistoryItems.push(priceHistoryItem)
    })

    return priceHistoryItems
  }

}
