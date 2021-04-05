/**
 *
 *
 *
 *
 */
import * as Types from './types'
import {AssetSymbol} from '../../../../../common/models'
import dayjs, {Dayjs} from 'dayjs'
import {FMP} from './FMP'

import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)

export interface ProviderConfigInterface {
    name: string,
    apiKey: string | null
}

const providers: Array<Types.DataProviderInterface> = []

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
for (const provider: ProviderConfigInterface of global.weHateGlobals_dataProviders) {
  if (provider.name.toLowerCase() === 'fmp') {
    providers.push(new FMP(provider.apiKey))
  }
}


export type ProviderSymbols = { [key: string]: Types.AssetSymbol[] }

class GlobalProvider {

    name: 'GlobalProvider'

    // constructor () {
    //
    // }

    private static getProviderFor (assetSymbol: AssetSymbol): Types.DataProviderInterface {

      return providers.find(provider => provider.name() === assetSymbol.get('dataProviderName'))
    }

    private static async callOne (method: string, ...args: IArguments[]) {

      for (const provider of providers) {

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (provider[method] !== undefined) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return await provider[method](...args)
        }

      }

      throw `DataProvider method "${method as string} is not supported by any providers ...`
    }

    private static async callAll (method: string, ...args: IArguments[]) {

      const data = {}
      for (const provider of providers) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (provider[method] !== undefined) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore @todo figure out the proper way
          data[provider.name()] = await provider[method](...args)
        }
      }

      return data
    }

    async fetchSupportedSymbols (): Promise<ProviderSymbols> {

      return await GlobalProvider.callAll('fetchSupportedSymbols')
    }

    private static adjustResolution (
      desiredResolution: Types.SymbolDataResolution,
      currentResolution: Types.SymbolDataResolution,
      data: Types.EndOfDayData[]
    ): Types.EndOfDayData[] {

      if (desiredResolution === currentResolution) {
        return data
      }
      const getDateId = (resolution: Types.SymbolDataResolution, date: dayjs.Dayjs): string => {
        switch (resolution) {
          case '1minute':
          case '5minutes':
          case '15minutes':
          case '30minutes':
            return date.format('YYYY-MM-DD HH:mm')
          case 'hour':
          case '4hours':
            return date.format('YYYY-MM-DD HH')
          case 'day':
            return date.format('YYYY-MM-DD')
          case 'week':
            return `${date.year()}-WK${date.week()}`
          case 'month':
            return date.format('YYYY-MM')
        }

        throw `Invalid resolution ${resolution}`
      }

      const merge = (a: Types.EndOfDayData | null, e: Types.EndOfDayData): Types.EndOfDayData => {
        if (!a) {
          return e
        }
        const isOlder = dayjs(a.date).diff(dayjs(e.date)) > 0

        const data: Types.EndOfDayData = {
          date   : isOlder ? e.date : a.date,
          close  : isOlder ? e.close : a.close,
          open   : isOlder ? a.open : e.open,
          high   : Math.max(a.high, e.high),
          low    : Math.min(a.low, e.low),
          volume : a.volume + e.volume,
        }

        return data
      }

      const output: { [key: string]: Types.EndOfDayData } = {}
      for (const elem of data) {
        const k = getDateId(desiredResolution, dayjs(elem.date))

        output[k] = merge(output[k] || null, elem)

      }

      return Object.values(output)
    }

    async getSymbolTimeSeriesData (
      assetSymbol: AssetSymbol,
      from: Dayjs,
      to: Dayjs,
      resolution: Types.SymbolDataResolution
    ): Promise<Types.EndOfDayData[]> {

      const result = await GlobalProvider
        .getProviderFor(assetSymbol)
        .fetchSymbolTimeSeriesData(
          assetSymbol.get('symbol'),
          from,
          to,
          resolution,
        )

      // Filter the extra data we received
      result.data = result.data.filter(elem => {
        const dt = dayjs(elem.date)
        // noinspection RedundantIfStatementJS
        if (dt.isBefore(from) || dt.isAfter(to)) {
          return false
        }
        return true
      })

      return GlobalProvider.adjustResolution(
        resolution,
        result.resolution,
        result.data
      )
    }

    async getCompanyProfile (
      assetSymbol: AssetSymbol
    ): Promise<Types.CompanyProfile> {

      const result = await GlobalProvider
        .getProviderFor(assetSymbol)
        .getCompanyProfile(
          assetSymbol.get('symbol')
        )
      return result
    }


    async getCompanyQuote (
      assetSymbol: AssetSymbol
    ): Promise<Types.CompanyQuote> {

      const result = await GlobalProvider
        .getProviderFor(assetSymbol)
        .getCompanyQuote(
          assetSymbol.get('symbol')
        )

      return result
    }

}


export const DataProvider = new GlobalProvider()

