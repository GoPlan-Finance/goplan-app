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

function CPL (ops: CPLType, value: unknown): { [key: string]: unknown } {

  const v: { [key: string]: unknown } = {}

  if (ops === '*') {
    ops = [
      'find', 'count', 'get', 'update', 'create', 'delete'
    ]
  }

  ops.forEach(op => {
    v[op] = value
  })

  return v
}


export function requiresAuthentication (ops: CPLType): { [key: string]: unknown } {

  return CPL(ops, {requiresAuthentication: true})
}

export function requiresAnonymous (ops: CPLType): { [key: string]: unknown } {

  return CPL(ops, {'*': true})
}

interface FieldInterface {
    type: FieldType
    targetClass?: string
    required?: boolean
}

interface CPLInterface {
    [key: string]: boolean
}

interface IndexInterface {
    [key: string]: number
}

interface FieldsInterface {
    [key: string]: FieldInterface
}

interface IndexesInterface {
    [key: string]: IndexInterface
}

interface CPLsInterface {
    [key: string]: CPLInterface

}

interface SchemaInterface {
    fields: FieldsInterface
    indexes: CPLsInterface
    classLevelPermissions: IndexesInterface
}

export function schema (className: string, schema: SchemaInterface): unknown {


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
