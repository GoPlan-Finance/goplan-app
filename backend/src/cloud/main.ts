/**
 *
 *
 *
 */
// eslint-disable-next-line  @typescript-eslint/no-var-requires

import { SecureObject } from '@utils/parse/SecureObject';

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
