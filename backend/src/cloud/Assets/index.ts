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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Parse.Cloud.beforeSubscribe(AssetSymbol, (request) => {

  console.log('sub', request)
  // code here
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Parse.Cloud.beforeUnsubscribe(AssetSymbol, (request) => {

  console.log('unsub', request)
  // code here
})
