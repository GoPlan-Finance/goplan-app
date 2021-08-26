/**
 *
 *
 *
 *
 *
 */

require('./triggers/beforeLogin');

interface RequestInterface {
  master?: boolean;
  user?: Parse.User;
}

export const assertUser = ({ master, user }: RequestInterface): void => {
  if (master) {
    return;
  }

  if (user) {
    return;
  }

  throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Please log-in');
};
