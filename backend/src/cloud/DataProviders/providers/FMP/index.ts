/**
 *
 *
 *
 */
import * as Types from '../types'
import {Dayjs} from 'dayjs'
import {SymbolDataResolution} from "../types";
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


export class FMP implements Types.DataProviderInterface {

    private apiKey: string
    private fmp: object

    constructor(apiKey: string) {
        this.apiKey = apiKey
        this.fmp = FinancialModelingPrep(this.apiKey)
    }

    public name(): string {
        return 'FMP'
    }


    async fetchSupportedSymbols(): Promise<Array<Types.AssetSymbol>> {

        //@ts-ignore
        const symbols = await this.fmp.list().availableTraded()

        return symbols
    }

    async fetchSymbolTimeSeriesData(
        symbol: string,
        from: Dayjs,
        to: Dayjs,
        resolution: Types.SymbolDataResolution,
    ): Promise<Types.TimeSeriesData> {

        const params = {
            start_date: from.toISOString(),
            end_date: to.toISOString()
        }
//@ts-ignore
        const stock = await this.fmp.stock(symbol)

        switch (resolution) {
            case "hour":
                return { resolution: 'hour', data: await stock.history1hour(params)}
            case "minute":
                return { resolution: 'hour', data:await stock.history1min(params)}
            case "day":
            case "month":
            case "week":
                const eod =  await stock.history(params)
                return { resolution: 'hour', data:eod.historical}
            default:
                throw `Resolution ${resolution} not implemented`
        }
    }
}

