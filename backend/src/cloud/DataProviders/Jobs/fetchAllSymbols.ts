/**
 *
 *
 *
 */
import {AssetSymbol, StockExchange} from '../../../../../common/models'
// noinspection ES6PreferShortImport
import {processBatch} from '../../../../../common/utils'

import * as DataProviderInterfaces from '../providers/types'
import {DataProvider, ProviderSymbols} from '../providers'
import {AssetProfile} from '../../../../../common/models/AssetProfile'
import {AssetIndustry} from '../../../../../common/models/AssetIndustry'
import {AssetSector} from '../../../../../common/models/AssetSector'
import {AssetAddressRegion} from '../../../../../common/models/AssetAddressRegion'
import dayjs from 'dayjs'

const USE_MASTER_KEY = {useMasterKey: true}


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


    await processBatch(symbols, async (apiSymbol: DataProviderInterfaces.AssetSymbol) => {

      const exchange = !apiSymbol.exchange ? null : await StockExchange.findOrCreate({
        name: apiSymbol.exchange
      }, true)

      const symbol = await AssetSymbol.findOrCreate<AssetSymbol>({
        symbol           : apiSymbol.symbol,
        dataProviderName : providerName,
        exchange,
      }, true)

      const apiProfile = await DataProvider.getCompanyProfile(symbol)
      symbol.set({
        currency : apiProfile.currency ? apiProfile.currency.toUpperCase() : null,
        name     : apiSymbol.name,
      })

      await symbol.save(null, USE_MASTER_KEY)

      const industry      = !apiProfile.industry ? null : await AssetIndustry.findOrCreate({
        name: apiProfile.industry
      }, true)
      const sector        = !apiProfile.sector ? null : await AssetSector.findOrCreate({
        name: apiProfile.sector
      }, true)
      const addressRegion = !apiProfile.country ? null : await AssetAddressRegion.findOrCreate({
        state   : apiProfile.state,
        country : apiProfile.country,
      }, true)
      const profile       = await AssetProfile.findOrCreate({
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

      await profile.save(null, USE_MASTER_KEY)


    }, (i, total) => {
      log.info(`Processing ${i}/${total}: ${symbols[i].symbol} for ${providerName}`)
      return true
    })
  }

})
