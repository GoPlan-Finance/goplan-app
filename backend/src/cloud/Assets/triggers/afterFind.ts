/**
 *
 *
 *
 */
import { assertEncryptedObject } from '@common/Auth';
import { SecureObject } from '@goplan-finance/utils';
import { Holding } from '@common/models/Holding';
import { assertUser } from '../../Auth';
import { AssetSymbol } from '@models';
import { AssetSymbolSearch } from '@cloud/Assets/Functions/search';

Parse.Cloud.afterFind(AssetSymbol, async request => {
  // if(request.objects){
  //
  //   if(request) {
  //     AssetSymbolSearch('asdf')
  //   }
  // }
});
