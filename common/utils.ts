import {Currencies, Currency, Money} from 'ts-money'


function sleep (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}


const processBatch = async <T, U>(
  data: Array<T>, func: (elem: T) => U,
  statusFunc: (curIndex: number, len: number, result: U) => boolean | undefined | null,
  nbParallel = 8): Promise<U[]> => {

  const results: Array<U> = []
  let index               = 0
  let iCompleted          = 0
  let abortAll            = false

  const runOne = async (curIndex: number) => {
    let result: U | null = null
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

  const runLoop = async (): Promise<void> => {
    while (!abortAll
        && iCompleted < data.length
        && index < data.length) {

      const curIndex = index++

      await sleep(0)
      await runOne(curIndex)
    }
  }

  // start first iteration
  const threads: Promise<void>[] = []
  while (--nbParallel >= 0) {
    threads.push(runLoop())
  }

  await Promise.all(threads)

  return results
}


const formatCurrency = (value: Money | number, currency: string, fixedDecimals = true) : string => {

  if (!currency) {
    throw 'Invalid currency'
  }

  currency = currency.toUpperCase()

  if (!Currencies[currency as keyof typeof Currencies]) {
    throw `Currency not found ${currency}`
  }

  const currencyInfo: Currency = Currencies[currency as keyof typeof Currencies] as Currency

  if (value instanceof Money) {
    value = value.toDecimal()
  } else if (!isNaN(Number(value))) {
    value = Number(value)
  }

  const valueStr = fixedDecimals ? value.toFixed(currencyInfo.decimal_digits) :  value.toString()

  if ([
    'EUR', 'GBP'
  ].includes(currency)) {
    return `${currencyInfo.symbol} ${valueStr}`
  }

  return `${valueStr} ${currencyInfo.symbol}`
}


export {
  sleep,
  processBatch,
  formatCurrency,
}

