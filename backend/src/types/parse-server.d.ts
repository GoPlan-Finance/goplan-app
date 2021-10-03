// This file contain duplicate types from Parse-Server that are not yet updated

declare module 'parse-server' {
  export namespace SchemaMigrations {
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
      type: FieldValueType;
      targetClass?: string;
      required?: boolean;
      defaultValue?: number | string | unknown;
    }

    type ClassNameType = '_User' | '_Role' | string;

    export interface ProtectedFieldsInterface {
      [key: string]: string[];
    }

    interface FieldsInterface {
      [key: string]: FieldInterface;
    }

    export interface IndexInterface {
      [key: string]: number;
    }

    export interface IndexesInterface {
      [key: string]: IndexInterface;
    }

    export type CLPOperation = 'find' | 'count' | 'get' | 'update' | 'create' | 'delete';
    type CLPPermission =
      | 'requiresAuthentication'
      | '*'
      | /* @Typescript 4.1+ `user:${string}` | `role:${string}` */ string;
    type CLPInfo = { [key: string]: boolean };
    type CLPData = { [key: string]: CLPOperation[] };
    type CLPValue = { [key: string]: boolean };
    type CLPInterface = { [key: string]: CLPValue };

    export interface CPLsInterface {
      find?: CLPInterface;
      count?: CLPInterface;
      get?: CLPInterface;
      update?: CLPInterface;
      create?: CLPInterface;
      delete?: CLPInterface;
      addField?: CLPInterface;
      protectedFields?: ProtectedFieldsInterface;
    }

    export interface JSONSchema {
      fields: FieldsInterface;
      indexes: IndexesInterface;
      classLevelPermissions: CPLsInterface;
    }

    export interface MigrationsOptions {
      schemas: JSONSchema[];
      strict: boolean;
      deleteExtraFields: boolean;
      recreateModifiedFields: boolean;
    }

    export class CLP {
      static allow(perms: CLPData): CLPInterface;
    }

    function makeSchema(
      className: ClassNameType,
      schema: Omit<JSONSchema, 'className'>
    ): JSONSchema;
  }
}
