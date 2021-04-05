type CPLType = '*' | ('find' | 'count' | 'get' | 'update' | 'create' | 'delete' /*| 'addField'*/)  []


function CPL(ops: CPLType, value: object): { [key: string]: object } {

    const v: { [key: string]: object } = {}

    if (ops === '*') {
        ops = ['find', 'count', 'get', 'update', 'create', 'delete']
    }

    ops.forEach(op => {
        v[op] = value
    })

    return v
}


export function requiresAuthentication(ops: CPLType): { [key: string]: object } {

    return CPL(ops, {requiresAuthentication: true})
}

export function requiresAnonymous(ops: CPLType): { [key: string]: object } {

    return CPL(ops, {'*': true})
}


interface SchemaInterface {
    fields: object
    indexes: object
    classLevelPermissions: object
}

export function schema(className: string, schema: SchemaInterface) {


    return {
        className,
        fields: {
            objectId: {type: 'String'},
            createdAt: {
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
            find: {},
            count: {},
            get: {},
            update: {},
            create: {},
            delete: {},
            addField: {},
            protectedFields: {
                // '*': [
                //     'symbol',
                // ],
            },
            ...schema.classLevelPermissions,
        },
    }
}
