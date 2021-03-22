/**
 *
 *
 *
 *
 */
import {DataProviderInterface, AssetSymbol} from './types'

interface ProviderConfigInterface {
    name: string,
    apiKey: string | null
}

const providers: Array<DataProviderInterface> = []

// @ts-ignore
for (const provider: ProviderConfigInterface of global.weHateGlobals_dataProviders) {
  if (provider.name.toLowerCase() === 'fmp') {
    const FMP = require('./FMP')

    providers.push(new FMP(provider.apiKey))
  }
}
export type ProviderSymbols = { [key: string]: AssetSymbol[] }

class DataProvider {

    name: 'GlobalProvider'

    constructor () {

    }

    private async callOne (method: string, ...args: IArguments[]) {

      for (const provider of providers) {

        // @ts-ignore
        if (provider[method] !== undefined) {
          // @ts-ignore
          return await provider[method](...args)
        }

      }

      throw `DataProvider method "${method as string} is not supported by any providers ...`
    }

    async fetchSupportedSymbols (): Promise<ProviderSymbols> {

      const symbols: ProviderSymbols = {}
      for (const provider of providers) {

        symbols[provider.name()] = await this.callOne('fetchSupportedSymbols', ...arguments)
      }

      return symbols
    }


}


module.exports = {
  DataProvider: new DataProvider()
}

