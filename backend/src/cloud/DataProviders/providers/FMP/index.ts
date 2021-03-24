/**
 *
 *
 *
 */
import * as Types from '../types'
import dayjs, {Dayjs} from 'dayjs'

// @ts-ignore
// noinspection ES6PreferShortImport
import FinancialModelingPrep = require('financialmodelingprep');

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

    private apiKey: string
    private fmp: unknown

    constructor (apiKey: string) {
      this.apiKey = apiKey
      this.fmp    = FinancialModelingPrep(this.apiKey)
    }

    public name (): string {
      return 'FMP'
    }


    async fetchSupportedSymbols (): Promise<Array<Types.AssetSymbol>> {

      //@ts-ignore
      const symbols = await this.fmp.list().availableTraded()

      return symbols
    }

    async fetchSymbolTimeSeriesData (
      symbol: string,
      from: Dayjs,
      to: Dayjs,
      resolution: Types.SymbolDataResolution,
    ): Promise<Types.TimeSeriesData> {

      const params = {
        start_date : from.toISOString(),
        end_date   : to.toISOString()
      }
      //@ts-ignore
      const stock = await this.fmp.stock(symbol)

      const query = async (res: Types.SymbolDataResolution, method: string): Promise<Types.TimeSeriesData> => {
        return {resolution: res, data: (await stock[method](params)).reverse()}
      }

      // The day values here are purely from observation of what the API returns. For long term historical data,
      // we will probably need to fetch from a different source, or cache data.

      // noinspection FallThroughInSwitchStatementJS
      switch (resolution) {
        case 'minute':
          if (dayjs().diff(from, 'days') < 2) {
            return await query('minute', 'history1min')
          }
          // eslint-disable-next-line no-fallthrough
        case '5minutes':
          if (dayjs().diff(from, 'days') < 11) {
            return await query('5minutes', 'history5min')
          }
          // eslint-disable-next-line no-fallthrough
        case '15minutes':
          if (dayjs().diff(from, 'days') < 18) {
            return await query('15minutes', 'history15min')
          }
          // eslint-disable-next-line no-fallthrough
        case '30minutes':
          if (dayjs().isAfter(from.subtract(42, 'days'))) {
            return await query('30minutes', 'history30min')
          }
          // eslint-disable-next-line no-fallthrough
        case 'hour':
          console.log(dayjs().diff(from, 'days'))
          if (dayjs().diff(from, 'days') < 48) {
            return await query('hour', 'history1hour')
          }
          // eslint-disable-next-line no-fallthrough
        case            '4hours'            :
          if (dayjs().diff(from, 'days') < 85) {
            return await query('4hours', 'history4hour')
          }
          // eslint-disable-next-line no-fallthrough
        case            'day'            :
        case            'month'            :
        case            'week'             : {
          const eod = await stock.history(params)
          return {resolution: 'day', data: eod.historical.reverse()}
        }
        default:
          throw `Resolution ${resolution} not implemented`
      }
    }

}

