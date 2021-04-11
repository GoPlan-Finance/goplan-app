/**
 *
 *
 *
 *
 */

import { AssetSymbol } from '/common/models'


require('./Functions/getEndOfDay')
require('./Functions/getProfile')
require('./Functions/getQuote')

Parse.Cloud.beforeSubscribe(AssetSymbol, (request) => {

  console.log('sub', request)
  // code here
})

Parse.Cloud.beforeUnsubscribe(AssetSymbol, (request) => {

  console.log('unsub', request)
  // code here
})
