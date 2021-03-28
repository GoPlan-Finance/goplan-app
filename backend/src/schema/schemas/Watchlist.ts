export const Watchlist = {
  className : 'Watchlist',
  fields    : {
    objectId  : {type: 'String'},
    createdAt : {
      type: 'Date',
    },
    updatedAt: {
      type: 'Date',
    },
    ACL       : {type: 'ACL'},
    name      : {type: 'String'},
    createdBy : {type: 'Pointer', targetClass: '_User'},
    symbols   : {type: 'Relation', targetClass: 'AssetSymbol'},
  },
  indexes: {
    objectId : {objectId: 1},
    name     : {name: 1}
  },
  classLevelPermissions: {
    find            : {requiresAuthentication: true},
    count           : {},
    get             : {requiresAuthentication: true},
    update          : {requiresAuthentication: true},
    create          : {requiresAuthentication: true},
    delete          : {requiresAuthentication: true},
    addField        : {},
    protectedFields : {
      // '*': [
      //     'symbol',
      // ],
    },
  },
}
