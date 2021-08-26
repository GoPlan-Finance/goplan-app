/**
 *
 *
 *
 */
import { assertUser } from '../../Auth';

Parse.Cloud.beforeSave(
  'ExternalDataProvider',
  async request => {
    assertUser(request);
    // @todo
    // assertEncrypted(request.object, 'credentials')

    request.object.set('user', request.user);
    request.object.setACL(new Parse.ACL(request.user));
  },
  {
    fields: {
      credentials: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        required: true,
        type: Object,
      },
    },
  }
);
