/**
 *
 *
 *
 *
 */

export interface AssetSymbol {
    name: string,
    symbol: string,
    exchange: string,
}

export interface DataProviderInterface {
    name(): string

    fetchSupportedSymbols(): Promise<Array<AssetSymbol>>

    test1234?(): void

}


