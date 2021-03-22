/**
 *
 *
 *
 *
 */
import * as Types from './types'
// noinspection ES6PreferShortImport
import {AssetSymbol} from '../../../../../common/models'
import {Dayjs} from 'dayjs'

import {FMP} from './FMP'

export interface ProviderConfigInterface {
    name: string,
    apiKey: string | null
}

const providers: Array<Types.DataProviderInterface> = []

// @ts-ignore
for (const provider: ProviderConfigInterface of global.weHateGlobals_dataProviders) {
  if (provider.name.toLowerCase() === 'fmp') {
    providers.push(new FMP(provider.apiKey))
  }
}


export type ProviderSymbols = { [key: string]: Types.AssetSymbol[] }

class DataProvider {

    name: 'GlobalProvider'

    // constructor () {
    //
    // }

    private static getProviderFor (assetSymbol: AssetSymbol): Types.DataProviderInterface {

      return providers.find(provider => provider.name() === assetSymbol.get('dataProviderName'))
    }

    private static async callOne (method: string, ...args: IArguments[]) {

      for (const provider of providers) {

        // @ts-ignore
        if (provider[method] !== undefined) {
          // @ts-ignore
          return await provider[method](...args)
        }

      }

      throw `DataProvider method "${method as string} is not supported by any providers ...`
    }

    private static async callAll (method: string, ...args: IArguments[]) {

      const data = {}
      for (const provider of providers) {
        // @ts-ignore
        if (provider[method] !== undefined) {
          // @ts-ignore @todo figure out the proper way
          data[provider.name()] = await provider[method](...args)
        }
      }

      return data
    }

    async fetchSupportedSymbols (): Promise<ProviderSymbols> {

      return await DataProvider.callAll('fetchSupportedSymbols')
    }

    async getEndOfDayData (
      assetSymbol: AssetSymbol,
      from: Dayjs,
      to: Dayjs): Promise<Types.EndOfDayData[]> {

      return await DataProvider
        .getProviderFor(assetSymbol)
        .fetchEndOfDay(assetSymbol.get('symbol'),
          from,
          to
        )
    }


}


module.exports = {
  DataProvider: new DataProvider()
}

