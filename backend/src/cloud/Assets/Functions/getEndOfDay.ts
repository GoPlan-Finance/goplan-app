/**
 *
 *
 *
 */
// noinspection ES6PreferShortImport
import {AssetSymbol} from "../../../../../common/models";
import dayjs  from "dayjs";


const USE_MASTER_KEY = {useMasterKey: true}

const {DataProvider} = require('../../DataProviders/providers')


const exchanges: { [key: string]: Parse.Object } = {}


Parse.Cloud.define('Assets--GetEndOfDay', async (request) => {
    if (!request.user) {
        throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Please log-in first')
    }

    const {from, to, assetSymbol: assetSymbolPointer} = request.params

    const assetSymbol = await AssetSymbol.createWithoutData(assetSymbolPointer.objectId).fetch(USE_MASTER_KEY)
    const data = await DataProvider.getEndOfDayData(
        assetSymbol,
        dayjs(from),
        dayjs(to)
    )

    return data
})
