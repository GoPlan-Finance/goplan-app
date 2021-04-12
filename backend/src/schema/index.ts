//from https://github.com/Moumouls/next-atomic-gql-server/

import { buildSchemas } from './buildSchemas'
import { schemas } from './schemas'


export const makeSchemas = async () : Promise<void> => buildSchemas(schemas)
