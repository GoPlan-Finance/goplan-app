/**
 *
 *
 *
 */
import {AssetSymbol, StockExchange} from '../../../../../common/models'
// noinspection ES6PreferShortImport
import {processBatch} from "../../../../../common/utils";

import * as DataProviderInterfaces from '../providers/types'
import {ProviderSymbols} from '../providers'

import {findOrCreate} from "models/objectUtils";

var Mutex = require('async-mutex').Mutex;

const USE_MASTER_KEY = {useMasterKey: true}

const {DataProvider} = require('../providers')

const getExchangeMutex = new Mutex();

const exchanges: { [key: string]: Parse.Object } = {}

const getExchange = async (name: string): Promise<StockExchange> => {

    if (exchanges[name]) {
        return exchanges[name]
    }

    await getExchangeMutex.runExclusive(async () => {
        exchanges[name] = await findOrCreate('StockExchange', {
            name: name
        }, true)
    })

    return exchanges[name]
}


Parse.Cloud.job('DataProviders--FetchAllSymbols', async (request) => {
    // params: passed in the job call
    // headers: from the request that triggered the job
    // log: the ParseServer logger passed in the request
    // message: a function to update the status message of the job object
    // @ts-ignore
    const {params, headers, log, message} = request


    const symbolsProviders = await DataProvider.fetchSupportedSymbols() as ProviderSymbols

    message(symbolsProviders.length)


    const processed: Array<string> = []
    for (const [
        providerName, symbols
    ] of Object.entries(symbolsProviders)) {
        log.info(`Processing ${symbols.length} symbols for ${providerName}`)

        await processBatch(symbols, async (symbol: DataProviderInterfaces.AssetSymbol) => {

            const exchange = await getExchange(symbol.exchange as string)
            const query = new Parse.Query(AssetSymbol)
            query.equalTo('symbol', symbol.symbol)
            query.equalTo('exchange', exchange)
            query.equalTo('dataProviderName', providerName)

            let s = await query.first(USE_MASTER_KEY)

            if (!s) {
                s = new AssetSymbol()
                s.set('symbol', symbol.symbol)
                s.set('name', symbol.name)
                s.set('exchange', exchange)
                s.set('dataProviderName', providerName)
                await s.save(null, USE_MASTER_KEY)
            }

        }, (i, total) => {
            log.info(`Processing ${i}/${symbols.length}: ${symbols[i].symbol} for ${providerName}`)
            return true
        })
    }

})
