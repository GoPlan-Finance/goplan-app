/**
 *
 *
 *
 */

import { SecureObject } from '@goplan-finance/utils';

SecureObject.setServerMode();

require('./Auth');
require('./User');

require('./Watchlists');
require('./WatchlistsItem');

require('./Transaction');
require('./Holding');

require('./Account');
require('./ExternalDataProvider');

require('./Assets');
require('./DataProviders');
