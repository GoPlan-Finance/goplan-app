const USE_MASTER_KEY = {useMasterKey: true}

const requiresAuthenticationCPL = { // @see https://docs.parseplatform.org/js/guide/#clp-and-acl-interaction
  find: {
    requiresAuthentication: true
  },
  create: {
    requiresAuthentication: true
  },
  get: {
    requiresAuthentication: true
  },
  update: {
    requiresAuthentication: true
  },
  addField: {
    // LEAVE EMPTY TO DISABLE
  },
  delete: {
    requiresAuthentication: true
  }
}

class BetterThanNothingMigration {

  static async v2021_03_06 () {
    const userSchema = new Parse.Schema('_User')
    userSchema.setCLP({   // @see https://docs.parseplatform.org/js/guide/#clp-and-acl-interaction
      find   : {},
      create : {
        '*': true
      },
      get    : {},
      update : {
        '*': true
      },
      addField : {},
      delete   : {}

    }
    )
    await userSchema.update()


    const dataProvider = new Parse.Schema('ExternalDataProvider')
    dataProvider.setCLP(requiresAuthenticationCPL)
    await dataProvider.save()
  }


  static async v2021_03_07 () {
    // create an instance to manage your class
    Parse.User.allowCustomUserClass(true)
    const userSchema = new Parse.Schema('_User')

    userSchema.addObject('profileInfo', {
      defaultValue: {}
    })
    userSchema.addObject('clientKey', {
      defaultValue: {}
    })

    await userSchema.update()


    const dataProvider = new Parse.Schema('ExternalDataProvider')

    // add any # of fields, without having to create any objects
    dataProvider
      .addString('name', {
        required: true,
      })
      .addObject('credentials', {
        required: true,
      })
      .addPointer('user', '_User')
      .addBoolean('isActive')

    // save/update this schema to persist your field changes
    await dataProvider.update()


  }


}


module.exports = {
  BetterThanNothingMigration,
}
