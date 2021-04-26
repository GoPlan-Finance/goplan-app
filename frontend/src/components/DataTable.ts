import { formatCurrency } from '/@common/utils'
import { Screens } from '/@utils/screens'
import * as dayjs from 'dayjs'

/* eslint-disable no-use-before-define */


export type CompareFn = (a : unknown, b : unknown) => number
export type FormatFn = (value : unknown, row : unknown) => void
export type ValueFn = (row : unknown, header : TableHeader) => unknown
export type SearchFn = (value : unknown, searchString : string) => boolean


export interface TableHeader {
  key? : string,
  sort? : 'asc' | 'desc'
  classes? : string,
  justify? : 'left' | 'right' | 'center'
  private? : boolean
  format? : FormatTypes | FormatFn
  compare? : FormatTypes | CompareFn
  value? : ValueFn
  width? : string
}


export type TableRow = Record<string, unknown>


interface FormatterInterface {
  format? : FormatFn
  compare? : CompareFn
  value? : ValueFn
//  search? : SearchFn
}


type FormatTypes = keyof typeof formatters


export type TableLayout = string[] | string[][]


export interface TableLayoutCollection {
  [Screens.DEFAULT]? : TableLayout,
  [Screens.SM]? : TableLayout,
  [Screens.MD]? : TableLayout,
  [Screens.LG]? : TableLayout,
  [Screens.XL]? : TableLayout,
  [Screens.XL2]? : TableLayout,
}


export interface TableConfig {
  fields : TableHeader[],
  tableLayout : TableLayoutCollection
  settings? : {
    actions : boolean,
    translationPrefix : string
    sort? : {
      field : string,
      direction : 'asc' | 'desc'
    }
  },
  filters : Record<string, any>,
  search : {
    handler : SearchFn
  }
}


export interface SortSettings {
  header : TableHeader,
  order : 'asc' | 'desc'
}


export interface RangeValue {
  from : number
  to : number
}


type Formatters = { [key : string] : FormatterInterface }

function dateFormat (format) {
  return {
    format  : (value : Date) => dayjs(value).format(format),
    compare : (a : Date, b : Date) => b.getTime() - a.getTime(),
  }
}

function currencyFormat (fixedDecimals) {
  return {
    format  : (value : number, row : unknown) => formatCurrency(value, row.currency, fixedDecimals),
    compare : (a, b) => {
      // @todo add currency conversions
      return b - a
    },
  }
}


export const formatters : Formatters = {
  date     : dateFormat('YYYY-MM-DD'),
  datetime : dateFormat('YYYY-MM-DD HH:mm:ss'),
  time     : dateFormat('HH:mm:ss'),

  currency : currencyFormat(true),
  money    : currencyFormat(false),

  percent: {
    format: (value : number) => `${(value * 100).toFixed(2)} %`,
  },

  range: {
    compare: (a : RangeValue, b : RangeValue) : number => {

      if (!a) {
        return 1
      }
      if (!b) {
        return -1
      }

      return (b.to - b.from) - (a.to - a.from)
    },
  },

  ___default___: {
    value   : (row : unknown, header : TableHeader) => row[header.key],
    format  : value => value,
    compare : (valueA, valueB) : number => {
      // if (valueA instanceof Money && valueB instanceof Money) {
      //   return valueB.toDecimal() - valueA.toDecimal()
      // }

      if (typeof valueA === 'string' || typeof valueB === 'string') {
        const textA = valueA ? String(valueA).toUpperCase() : ''
        const textB = valueB ? String(valueB).toUpperCase() : ''
        return textA.localeCompare(textB)
      }

      return valueB - valueA
    },
  },

}


export function getHandler<T> (field : TableHeader, op : keyof FormatterInterface) : T {

  const formatHandler = (handler, op) => {
    const formatType : FormatterInterface = formatters[handler as FormatTypes]

    if (formatType && formatType[op]) {
      return formatType[op] as unknown as T
    }
    return null
  }

  if (typeof field[op] === 'function') {
    return field[op] as unknown as T
  }

  const format = field['format']
  if (typeof format === 'string') {
    const handler = formatHandler(format, op)
    if (handler) {
      return handler
    }
  }

  const handler = formatHandler('___default___', op)
  if (handler) {
    return handler
  }

  throw `Unknown table data "${op}" for "${handler}"`
}


export function findTableLayout (tableLayouts : TableLayoutCollection, breakpoint : Screens) {
  let currentScreenSizeFound = false
  for (const screenSize of Object.values(Screens).reverse()) {
    if (screenSize === breakpoint) {
      currentScreenSizeFound = true
      if (tableLayouts[breakpoint]) {
        return tableLayouts[breakpoint]
      }
    } else if (currentScreenSizeFound && tableLayouts[screenSize]) {
      return tableLayouts[screenSize]
    }
  }
  return tableLayouts[Screens.DEFAULT]
}
