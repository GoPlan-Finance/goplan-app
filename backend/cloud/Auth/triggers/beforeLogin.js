/**
 *
 *
 *
 */

Parse.Cloud.beforeLogin(async request => {

  const { object: user } = request

  const { google } = user.get('authData')

  if (!google) {
    throw new Error('Access denied, this login method is disabled')
  }

})
