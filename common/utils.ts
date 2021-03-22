function sleep (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}


const processBatch = async <T, U>(
  data: Array<T>, func: (elem: T) => U,
  statusFunc: (curIndex: number, len: number, result: U) => boolean | undefined = null,
  nbParallel = 8): Promise<U[]> => {

  const results: Array<U> = []
  let index               = 0
  let iCompleted          = 0
  let abortAll            = false

  const runOne = async (curIndex: number) => {
    let result: U = null
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

  const runLoop = async () => {
    while (!abortAll
        && iCompleted < data.length
        && index < data.length) {

      const curIndex = index++

      await sleep(0)
      await runOne(curIndex)
    }
  }

  // start first iteration
  const threads = []
  while (--nbParallel >= 0) {
    threads.push(runLoop())
  }

  await Promise.all(threads)

  return results
}


export {
  sleep,
  processBatch,
}
