//from https://github.com/Moumouls/next-atomic-gql-server/

import {schemas} from './schemas'
import {buildSchemas} from './buildSchemas'

export const makeSchemas = async (): Promise<void> => buildSchemas(schemas)
