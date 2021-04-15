/**
 *
 *
 *
 */
import {
  AssetAddressRegion,
  AssetIndustry,
  AssetProfile,
  AssetSector,
  AssetSymbol,
  StockExchange,
} from '/@common/models'
import { CacheableQuery } from '/@common/Query/CacheableQuery'
// noinspection ES6PreferShortImport
import { processBatch } from '/@common/utils'
import * as dayjs from 'dayjs'
import { DataProvider, ProviderSymbols } from '../providers'

import * as DataProviderInterfaces from '../providers/types'

Parse.Cloud.job('DataProviders--FetchAllSymbols', async (request) => {
  // params: passed in the job call
  // headers: from the request that triggered the job
  // log: the ParseServer logger passed in the request
  // message: a function to update the status message of the job object

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const {/*params, headers,*/ log, message} = request


  const symbolsProviders = await DataProvider.fetchSupportedSymbols() as ProviderSymbols

  message(symbolsProviders.length)


  // const processed: Array<string> = []

  for (const [
    providerName, symbols
  ] of Object.entries(symbolsProviders)) {
    log.info(`Processing ${symbols.length} symbols for ${providerName}`)


    await processBatch(symbols, async (apiSymbol : DataProviderInterfaces.AssetSymbol) => {

      const exchange = !apiSymbol.exchange ? null : await CacheableQuery.create(StockExchange).findOrCreate({
        name: apiSymbol.exchange,
      }, true)

      const symbol = await CacheableQuery.create(AssetSymbol).findOrCreate({
        symbol           : apiSymbol.symbol,
        dataProviderName : providerName,
        exchange,
      }, true)

      const apiProfile = await DataProvider.getCompanyProfile(symbol)
      symbol.set({
        currency : apiProfile.currency ? apiProfile.currency.toUpperCase() : null,
        name     : apiSymbol.name,
      })

      await symbol.save(null, AssetSymbol.useMasterKey(true))

      const industry      = !apiProfile.industry ? null : await CacheableQuery.create(AssetIndustry).findOrCreate({
        name: apiProfile.industry,
      }, true)
      const sector        = !apiProfile.sector ? null : await CacheableQuery.create(AssetSector).findOrCreate({
        name: apiProfile.sector,
      }, true)
      const addressRegion = !apiProfile.country ? null : await CacheableQuery.create(AssetAddressRegion).findOrCreate({
        state   : apiProfile.state,
        country : apiProfile.country,
      }, true)
      const profile       = await CacheableQuery.create(AssetProfile).findOrCreate({
        symbol,
        exchange,
      }, true)

      const ipoDate = dayjs(apiProfile.ipoDate)

      profile.set({
        industry,
        sector,
        addressRegion,

        name              : apiProfile.companyName,
        currency          : apiProfile.currency,
        phone             : apiProfile.phone,
        address           : apiProfile.address,
        country           : apiProfile.country,
        state             : apiProfile.state,
        city              : apiProfile.city,
        zip               : apiProfile.zip,
        image             : apiProfile.image,
        ipoDate           : ipoDate.isValid() ? ipoDate.toDate() : null,
        website           : apiProfile.website,
        fullTimeEmployees : apiProfile.fullTimeEmployees,
        description       : apiProfile.description,
        ceo               : apiProfile.ceo,
      })

      await profile.save(null, AssetProfile.useMasterKey(true))


    }, (i, total) => {
      log.info(`Processing ${i}/${total}: ${symbols[i].symbol} for ${providerName}`)
      return true
    })
  }

})
