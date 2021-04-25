type CPLType = '*' | ('find' | 'count' | 'get' | 'update' | 'create' | 'delete' /*| 'addField'*/)  []
type FieldType =
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'Date'
  | 'File'
  | 'GeoPoint'
  | 'Polygon'
  | 'Array'
  | 'Object'
  | 'Pointer'
  | 'Relation';


interface FieldInterface {
  type : FieldType
  targetClass? : string
  required? : boolean
  defaultValue? : number | string | unknown | null
}


interface CPLInterface {
  requiresAuthentication? : boolean
  '*'? : boolean
}


interface IndexInterface {
  [key : string] : number
}


interface FieldsInterface {
  [key : string] : FieldInterface
}


interface ProtectedFieldsInterface {
  [key : string] : string[]
}


interface IndexesInterface {
  [key : string] : IndexInterface
}


interface CPLsInterface {
  find? : CPLInterface,
  count? : CPLInterface,
  get? : CPLInterface,
  update? : CPLInterface,
  create? : CPLInterface,
  delete? : CPLInterface,
  addField? : CPLInterface,
  protectedFields? : ProtectedFieldsInterface
}


interface SchemaInterface {
  fields : FieldsInterface
  indexes : IndexesInterface
  classLevelPermissions : CPLsInterface
}


function CPL (ops : CPLType, value : CPLInterface) : CPLsInterface {

  const v : CPLsInterface = {}

  if (ops === '*') {
    ops = [
      'find', 'count', 'get', 'update', 'create', 'delete',
    ]
  }

  ops.forEach(op => {
    v[op] = value
  })

  return v
}


export function requiresAuthentication (ops : CPLType) : CPLsInterface {

  return CPL(ops, {requiresAuthentication: true})
}

export function requiresAnonymous (ops : CPLType) : CPLsInterface {

  return CPL(ops, {'*': true})
}

export function schema (className : string, schema : SchemaInterface) : unknown {


  return {
    className,
    fields: {
      objectId  : {type: 'String'},
      createdAt : {
        type: 'Date',
      },
      updatedAt: {
        type: 'Date',
      },
      ACL: {type: 'ACL'},
      ...schema.fields,
    },
    indexes: {
      objectId: {objectId: 1},
      ...schema.indexes,
    },
    classLevelPermissions: {
      find            : {},
      count           : {},
      get             : {},
      update          : {},
      create          : {},
      delete          : {},
      addField        : {},
      protectedFields : {
        // '*': [
        //     'symbol',
        // ],
      },
      ...schema.classLevelPermissions,
    },
  }
}
