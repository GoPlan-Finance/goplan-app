export const AssetSymbol = {
  className : 'AssetSymbol',
  fields    : {
    objectId  : {type: 'String'},
    createdAt : {
      type: 'Date',
    },
    updatedAt: {
      type: 'Date',
    },
    ACL              : {type: 'ACL'},
    name             : {type: 'String'},
    symbol           : {type: 'String'},
    dataProviderName : {type: 'String'},
    exchange         : {type: 'Pointer', targetClass: 'StockExchange'},
  },
  indexes: {
    objectId : {objectId: 1},
    symbol   : {symbol: 1}
  },
  classLevelPermissions: {
    find            : {requiresAuthentication: true},
    count           : {},
    get             : {requiresAuthentication: true},
    update          : {},
    create          : {},
    delete          : {},
    addField        : {},
    protectedFields : {
      // '*': [
      //     'symbol',
      // ],
    },
  },
}
