/**
 *
 *
 *
 */
import * as Types from '../types'
import {Dayjs} from "dayjs";
// noinspection ES6PreferShortImport

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


class FMP implements Types.DataProviderInterface {

    private apiKey: string

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    public name(): string {
        return 'FMP'
    }


    async fetchSupportedSymbols(): Promise<Array<Types.AssetSymbol>> {

        const symbols = await FinancialModelingPrep(this.apiKey).list().availableTraded()

        return symbols
    }


    async fetchEndOfDay?(symbol: string, from: Dayjs, to: Dayjs): Promise<Types.EndOfDayData[]> {

        const eod = await FinancialModelingPrep(this.apiKey)
            .stock(symbol)
            .history({
                start_date: from.toISOString(),
                end_date: to.toISOString()
            })




        return eod.historical
    }

}

module.exports = FMP
