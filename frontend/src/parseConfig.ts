/**
 *
 *
 *
 */

// @todo  Global Parse instance created in index.html, this is probably bad and we need to make require('parse') work
// withh vite


Parse.initialize('goplan-finance')

window.Parse.serverURL = 'https://goplan.finance/parse'

if (import.meta.env.VITE_APP_PARSE_API_LOCATION === 'local') {
  window.Parse.serverURL = 'http://local.goplan.finance:1337/parse'
}

window.Parse.enableLocalDatastore()
Parse.CoreManager.setStorageController(Parse.IndexedDB)


// import { SecureObject } from '/@common/models/base/SecureObject'
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-ignore
// const ParseObjectController = Parse.CoreManager.getObjectController()
//
//
// const DefaultController = {
//   fetch (
//     target : Parse.Object | Array<Parse.Object>,
//     forceFetch : boolean,
//     options : any,
//   ) : Promise<Array<void> | Parse.Object> {
//     debugger
//     const object = ParseObjectController.fetch(target, forceFetch, options)
//
//
//
//     return object
//
//
//   },
//
//   async destroy (
//     target : Parse.Object | Array<Parse.Object>,
//     options : any,
//   ) : Promise<Array<void> | Parse.Object> {
//
//
//     return ParseObjectController.fetch(target, options)
//   },
//
//   async save (target : Parse.Object | Array<Parse.Object | Parse.File>, options : any) {
//     debugger
//     if (target instanceof SecureObject) {
//       await target.encrypt()
//     }
//
//     target = ParseObjectController.save(target, options)
//
//     if (target instanceof SecureObject) {
//       await target.decrypt()
//     }
//
//     return target
//   },
// }
//
//
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-ignore
// Parse.CoreManager.setObjectController(DefaultController)
