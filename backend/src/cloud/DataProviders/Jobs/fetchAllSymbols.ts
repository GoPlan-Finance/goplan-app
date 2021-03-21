/**
 *
 *
 *
 */
import {Asset, StockExchange} from '../../../../../common/models'
import {Symbol} from '../providers/types'
import {ProviderSymbols} from '../providers'

const USE_MASTER_KEY = {useMasterKey: true}

const {DataProvider} = require('../providers')


const exchanges: { [key: string]: Parse.Object } = {}

const getExchange = async (name: string) => {

  if (exchanges[name]) {
    return exchanges[name]
  }


  const qE = new Parse.Query(StockExchange)
  qE.equalTo('name', name)

  let exchange = await qE.first(USE_MASTER_KEY)
  if (!exchange) {
    exchange = new StockExchange()
    exchange.set('name', name)
    await exchange.save(null, USE_MASTER_KEY)
  }

  exchanges[name] = exchange

  return exchange
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


    //    const promises = []
    for (const symbol of symbols as symbol[]) {
      if (processed.includes(symbol.symbol)) {
        continue
      }
      processed.push(symbol.symbol)

      //   await sleep(10)

      //promises.push(new Promise<void>(async resolve => {

      log.info(`Processing ${symbol.symbol} for ${providerName}`)

      const exchange = getExchange(symbol.exchange as string)
      const query    = new Parse.Query(Asset)
      query.equalTo('symbol', symbol.symbol)
      query.equalTo('exchange', exchange)
      query.equalTo('dataProviderName', providerName)

      let s = await query.first(USE_MASTER_KEY)

      if (!s) {
        s = new Asset()
        s.set('symbol', symbol.symbol)
        s.set('name', symbol.name)
        s.set('exchange', exchange)
        s.set('dataProviderName', providerName)
        await s.save(null, USE_MASTER_KEY)
      }

      //       resolve()
      //    }))

    }

    //   await Promise.all(promises)


  }


})
