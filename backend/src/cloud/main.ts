/**
 *
 *
 *
 */
// eslint-disable-next-line  @typescript-eslint/no-var-requires
const moduleAlias = require('module-alias')
moduleAlias.addAlias('/@common', `${__dirname}/../../../common`)

import { SecureObject } from '/@common/models/base/SecureObject'


SecureObject.setServerMode()

require('./Auth')
require('./User')

require('./Watchlists')
require('./WatchlistsItem')

require('./Transaction')
require('./Holding')

require('./Account')
require('./ExternalDataProvider')

require('./Assets')
require('./DataProviders')
