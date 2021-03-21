/**
 *
 *
 *
 *
 */

export interface Symbol {
    name: string,
    symbol: string,
    exchange: string,
}

export interface DataProviderInterface {
    name(): string

    fetchSupportedSymbols(): Promise<Array<symbol>>

    test1234?(): void

}


