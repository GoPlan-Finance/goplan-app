/**
 *
 *
 *
 */
import { assertEncryptedObject } from '@common/Auth';
import { SecureObject } from '@goplan-finance/utils';
import { assertUser } from '../../Auth';

Parse.Cloud.beforeSave(
  'Account',
  async request => {
    assertUser(request);
    assertEncryptedObject(request.object as SecureObject);

    if (request.object.isNew()) {
      request.object.set('createdBy', request.user);
    }

    if (!request.master) {
      request.object.setACL(new Parse.ACL(request.user));
    }
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {
    fields: {
      name: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        required: true,
      },
      // currency: {
      //   required : false,
      //   options  : (value : string) => {
      //     return value.length > 1
      //   },
      //   error: 'Invalid currency',
      // },
    },
  }
);
