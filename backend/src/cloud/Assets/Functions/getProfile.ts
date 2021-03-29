/**
 *
 *
 *
 */
// noinspection ES6PreferShortImport
import {AssetSymbol} from '../../../../../common/models'
import {assertUser} from '../../Auth'

const USE_MASTER_KEY = {useMasterKey: true}

const {DataProvider} = require('../../DataProviders/providers')

Parse.Cloud.define('Assets--GetProfile', async (request) => {
  assertUser(request)

  const {assetSymbolId} = request.params

  const assetSymbol = await AssetSymbol.createWithoutData(assetSymbolId).fetch(USE_MASTER_KEY)

  if (!assetSymbol) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `Symbol ${assetSymbolId} not found`)
  }

  const result = await DataProvider.getCompanyProfile(
    assetSymbol,
  )

  return result
})
