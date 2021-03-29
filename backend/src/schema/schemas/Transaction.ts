export const Transaction = {
  className : 'Transaction',
  fields    : {
    objectId  : {type: 'String'},
    createdAt : {
      type: 'Date',
    },
    updatedAt: {
      type: 'Date',
    },
    ACL       : {type: 'ACL'},
    createdBy : {type: 'Pointer', targetClass: '_User'},
    symbol    : {type: 'Pointer', targetClass: 'AssetSymbol', required: true},
    date      : { type: 'Date', required: true},
    price     : { type: 'Object', required: true},
    quantity  : { type: 'Object', required: true},
    type      : { type: 'Object', required: true},
  },
  indexes: {
    objectId: {objectId: 1},
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
