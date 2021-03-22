export const StockExchange = {
  className : 'StockExchange',
  fields    : {
    objectId  : {type: 'String'},
    createdAt : {
      type: 'Date',
    },
    updatedAt: {
      type: 'Date',
    },
    ACL  : {type: 'ACL'},
    name : {type: 'String'},
  },
  indexes: {
    objectId : {objectId: 1},
    name     : {name: 1},
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
      '*': [
        'name',
      ],
    },
  },
}
