import { Currencies, Currency, Money } from 'ts-money'


function sleep (ms : number) : Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

type StringKeys<T> = Extract<keyof T, string>;


const processBatch = async <T, U> (
  data : Array<T>, func : (elem : T) => U,
  statusFunc : (curIndex : number, len : number, result : U) => boolean | undefined | null,
  nbParallel = 8,
) : Promise<U[]> => {

  const results : Array<U> = []
  let index                = 0
  let iCompleted           = 0
  let abortAll             = false

  const runOne = async (curIndex : number) => {
    let result : U | null = null
    try {
      result = await func(data[curIndex])
    } catch (error) {
      console.error(error)
      result = error
    }
    const statusResult = statusFunc ? await statusFunc(curIndex, data.length, result) : true

    if (statusResult === false) {
      console.warn('Abort "signal" received')
      abortAll = true
    }

    results.push(result)

    ++iCompleted
  }

  const runLoop = async () : Promise<void> => {
    while (!abortAll
           && iCompleted < data.length
           && index < data.length) {

      const curIndex = index++

      await sleep(0)
      await runOne(curIndex)
    }
  }

  // start first iteration
  const threads : Promise<void>[] = []
  while (--nbParallel >= 0) {
    threads.push(runLoop())
  }

  await Promise.all(threads)

  return results
}


const formatCurrency = (value : Money | number, currency : string, fixedDecimals = true) : string => {

  if (!currency) {
    throw 'Invalid currency'
  }

  if (value instanceof Money) {
    value = value.toDecimal()
  } else if (!isNaN(Number(value))) {
    value = Number(value)
  }


  // return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: currency }).format(value)


  currency = currency.toUpperCase()

  if (!Currencies[currency as keyof typeof Currencies]) {
    throw `Currency not found ${currency}`
  }

  const currencyInfo : Currency = Currencies[currency as keyof typeof Currencies] as Currency


  /* cap max decimals to either currency, or 4 */
  const nbDecimals = fixedDecimals ? currencyInfo.decimal_digits : Math.max(currencyInfo.decimal_digits, 4)
  const valueStr   = value.toFixed(nbDecimals)

  if ([
    'EUR', 'GBP',
  ].includes(currency)) {
    return `${currencyInfo.symbol} ${valueStr}`
  }

  return `${valueStr} ${currencyInfo.symbol}`
}

type groupByFn<T> = (value : T) => string
type groupByResult<T> = { [key : string] : T[] }


class ArrayUtils {

  public static groupBy<T> (array : T[], keyCb : groupByFn<T>) : groupByResult<T> {

    return array.reduce((result : groupByResult<T>, currentValue) => {

      const key : string = keyCb(currentValue as T)

      result[key] = result[key] || []

      result[key].push(
        currentValue,
      )
      return result
    }, {})
  }

}


class StringUtils {

  static toNumberOrNull (value : string) : number | null {
    const floatVal = parseFloat(value)

    if (isNaN(floatVal)) {
      return null
    }

    return floatVal
  }


}


export {
  StringUtils,
  ArrayUtils,
  sleep,
  processBatch,
  formatCurrency,
}
export type { StringKeys }

