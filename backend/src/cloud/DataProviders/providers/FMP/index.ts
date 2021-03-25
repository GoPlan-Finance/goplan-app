/**
 *
 *
 *
 */
import * as Types from '../types'
import dayjs, {Dayjs} from 'dayjs'

// @ts-ignore
// noinspection ES6PreferShortImport
import * as FMPApi from 'financialmodelingprep-openapi'


// // Simple Examples
//
// // API route: /quote/AAPL
// fmp.stock('aapl').quote().then(response => console.log(response));
// //API route: /quote/AAPL,MSFT
// fmp.stock(['AAPL', 'MSFT']).quote().then(response => console.log(response));
//
// // API route: /stock/sectors-performance
// fmp.market.sector_performance().then(response => console.log(response));
//
// // API route: /quote/USDEUR
// fmp.forex('USD', 'EUR').rate().then(response => console.log(response));


export class FMP implements Types.DataProviderInterface {

    private config: FMPApi.Configuration

    constructor (apiKey: string) {
      this.config = new FMPApi.Configuration({
        apiKey
      })
    }

    public name (): string {
      return 'FMP'
    }


    async fetchSupportedSymbols (): Promise<Array<Types.AssetSymbol>> {

      //@ts-ignore
      const listApi = new FMPApi.ListApi(this.config)

      const response = await listApi.listSymbols('available-traded')
      return response.data
    }

    async fetchSymbolTimeSeriesData (
      symbol: string,
      from: Dayjs,
      to: Dayjs,
      resolution: Types.SymbolDataResolution,
    ): Promise<Types.TimeSeriesData> {

      //@ts-ignore
      const historyApi = new FMPApi.HistoryApi(this.config)

      const query = async (out: Types.SymbolDataResolution, res: '1min' | '5min' | '15min' | '30min' | '1hour' | '4hour') => {
        const response = await historyApi.intraDayPrices(symbol, res)
        return {resolution: out, data: response.data.reverse()}
      }

      switch (resolution) {
        case '1minute':
          if (dayjs().diff(from, 'days') < 2) {
            return await query('1minute', '1min')
          }
          // eslint-disable-next-line no-fallthrough
        case '5minutes':
          if (dayjs().diff(from, 'days') < 11) {
            return await query('5minutes', '5min')
          }
          // eslint-disable-next-line no-fallthrough
        case '15minutes':
          if (dayjs().diff(from, 'days') < 18) {
            return await query('15minutes', '15min')
          }
          // eslint-disable-next-line no-fallthrough
        case '30minutes':
          if (dayjs().isAfter(from.subtract(42, 'days'))) {
            return await query('30minutes', '30min')
          }
          // eslint-disable-next-line no-fallthrough
        case 'hour':
          if (dayjs().diff(from, 'days') < 48) {
            return await query('hour', '1hour')
          }
          // eslint-disable-next-line no-fallthrough
        case            '4hours'            :
          if (dayjs().diff(from, 'days') < 85) {
            return await query('4hours', '4hour')
          }
          // eslint-disable-next-line no-fallthrough
        case            'day'            :
        case            'month'            :
        case            'week'             : {
          const eod = await historyApi.dailyPrices(symbol, from.toISOString(), to.toISOString())
          return {resolution: 'day', data: eod.data.historical.reverse()}
        }
        default:
          throw `Resolution ${resolution} not implemented`
      }
    }

}

