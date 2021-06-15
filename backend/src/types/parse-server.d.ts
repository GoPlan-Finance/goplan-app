// This file contain duplicate types from Parse-Server that are not yet updated

declare module 'parse-server' {

  export namespace SchemaMigrations {
    export type CLPType = '*' | ('find' | 'count' | 'get' | 'update' | 'create' | 'delete') /*| 'addField'*/[];


    export type FieldValueType =
      | 'String'
      | 'Boolean'
      | 'File'
      | 'Number'
      | 'Relation'
      | 'Pointer'
      | 'Date'
      | 'GeoPoint'
      | 'Polygon'
      | 'Array'
      | 'Object';


    interface FieldInterface {
      type : FieldValueType,
      targetClass? : string,
      required? : boolean,
      defaultValue? : any,
    }

    type ClassNameType = '_User' | '_Role' | string;


    export interface CLPInterface {
      requiresAuthentication? : boolean;
      '*'? : boolean;
    }


    export interface ProtectedFieldsInterface {
      [key : string] : string[];
    }

    interface FieldsInterface {
      [key : string] : FieldInterface,
    }



    export interface IndexInterface {
      [key : string] : number;
    }


    export interface IndexesInterface {
      [key : string] : IndexInterface;
    }


    export interface MigrationsOptions {
      schemas : JSONSchema[];
      strict : boolean;
      deleteExtraFields : boolean;
      recreateModifiedFields : boolean;
    }



    interface CPLInterface {
      requiresAuthentication? : boolean,
      '*'? : boolean,
    }


    export interface CPLsInterface {
      find? : CPLInterface,
      count? : CPLInterface,
      get? : CPLInterface,
      update? : CPLInterface,
      create? : CPLInterface,
      delete? : CPLInterface,
      addField? : CPLInterface,
      protectedFields? : ProtectedFieldsInterface
    }


    export interface JSONSchema {
      fields : FieldsInterface,
      indexes : IndexesInterface,
      classLevelPermissions : CPLsInterface,
    }


    export class CLPHelper {
      static requiresAuthentication (ops : CLPType) : CPLsInterface ;

      static requiresAnonymous (ops : CLPType) : CPLsInterface ;
    }


    function makeSchema (className : ClassNameType, schema : Omit<JSONSchema, 'className'>) : JSONSchema ;


  }
}
