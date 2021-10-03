// declare module 'parse/dist/parse.min.js';

// eslint-disable-next-line init-declarations
// declare let Parse

declare module 'parse/dist/parse' {
  // eslint-disable-next-line init-declarations
  const captureType: typeof Parse;
  // eslint-disable-next-line init-declarations
  const subType: {
    Parse: typeof captureType;
  };
  export = subType;
}

// declare module "parse" {
//   var captureType: typeof Parse;
//   var subType: {
//     Parse: typeof captureType;
//   }
//   export = subType;
// }
