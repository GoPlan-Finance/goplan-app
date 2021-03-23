/**
 *
 *
 *
 */
// noinspection ES6PreferShortImport
import {AssetSymbol} from '../../../../../common/models'
import dayjs from 'dayjs'

const USE_MASTER_KEY = {useMasterKey: true}

const {DataProvider} = require('../../DataProviders/providers')

Parse.Cloud.define('Assets--GetEndOfDay', async (request) => {
    if (!request.user) {
        throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Please log-in first')
    }

    const {from, to, resolution, assetSymbolId} = request.params

    const assetSymbol = await AssetSymbol.createWithoutData(assetSymbolId).fetch(USE_MASTER_KEY)

    if (!assetSymbol) {
        throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `Symbol ${assetSymbolId} not found`)
    }

    const result = await DataProvider.getSymbolTimeSeriesData(
        assetSymbol,
        dayjs(from),
        dayjs(to),
        resolution,
    )

    return result
})
