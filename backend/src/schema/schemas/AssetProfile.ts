import { requiresAuthentication, schema } from './base/defaults'


export default schema('AssetProfile', {
  fields: {
    symbol   : {type: 'Pointer', targetClass: 'AssetSymbol', required: true},
    exchange : {type: 'Pointer', targetClass: 'StockExchange', required: true},

    industry : {type: 'Pointer', targetClass: 'AssetIndustry', required: false},
    sector   : {type: 'Pointer', targetClass: 'AssetSector', required: false},

    addressRegion: {type: 'Pointer', targetClass: 'AssetAddressRegion', required: false},

    name              : {type: 'String'},
    currency          : {type: 'String'},
    phone             : {type: 'String'},
    address           : {type: 'String'},
    country           : {type: 'String'},
    state             : {type: 'String'},
    city              : {type: 'String'},
    zip               : {type: 'String'},
    image             : {type: 'String'},
    ipoDate           : {type: 'Date'},
    website           : {type: 'String'},
    fullTimeEmployees : {type: 'Number'},
    description       : {type: 'String'},
    ceo               : {type: 'String'},

    // price: number;
    // beta?: number;
    // volAvg?: number;
    // mktCap?: number;
    // lastDiv?: number;
    // range?: string;
    // changes?: number;
    // isin?: string;
    // cusip?: string;
  },
  indexes: {
    symbol: {symbol: 1},

  },
  classLevelPermissions: {
    ...requiresAuthentication([
      'find', 'get',
    ]),

    protectedFields: {
      // '*': [
      //     'symbol',
      // ],
    },
  },
})
