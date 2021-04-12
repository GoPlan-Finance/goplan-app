/**
 *
 *
 *
 */
// noinspection ES6PreferShortImport
import { AssetSymbol } from '/common/models'
import { CacheableQuery } from '/common/Query/CacheableQuery'
import { assertUser } from '../../Auth'

import { DataProvider } from '../../DataProviders/providers'


Parse.Cloud.define('Assets--GetProfile', async (request) => {
  assertUser(request)

  const {assetSymbolId} = request.params

  const assetSymbol = await CacheableQuery.create(AssetSymbol).getObjectById(assetSymbolId, true)

  if (!assetSymbol) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `Symbol ${assetSymbolId} not found`)
  }

  const result = await DataProvider.getCompanyProfile(
    assetSymbol,
  )

  return result
})
