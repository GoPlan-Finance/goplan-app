/**
 *
 *
 *
 */
import {DataProviderInterface, AssetSymbol} from '../types'

const FinancialModelingPrep = require('financialmodelingprep')

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


class FMP implements DataProviderInterface {

    private apiKey: string

    constructor (apiKey: string) {
      this.apiKey = apiKey
    }

    public name (): string {
      return 'FMP'
    }


    async fetchSupportedSymbols (): Promise<Array<AssetSymbol>> {

      const symbols = await FinancialModelingPrep(this.apiKey).list().availableTraded()

      return symbols
    }

}

module.exports = FMP
