/**
 *
 *
 *
 *
 */
import {Dayjs} from 'dayjs'


export interface AssetSymbol {
    name: string,
    symbol: string,
    exchange: string,
}

export type SymbolDataResolution =
    '1minute'
    | '5minutes'
    | '30minutes'
    | '15minutes'
    | 'hour'
    | '4hours'
    | 'day'
    | 'week'
    | 'month'


export interface EndOfDayData {
    date: string,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    // "unadjustedVolume" : number,
    // "change" : number,
    // "changePercent" : number,
    // "vwap" : number,
    // "label" : string,
    // "changeOverTime" :number
}

export interface TimeSeriesData {
    resolution: SymbolDataResolution
    data: EndOfDayData[]
}

export interface DataProviderInterface {

    name(): string

    fetchSupportedSymbols(): Promise<Array<AssetSymbol>>

    fetchSymbolTimeSeriesData?(
        symbol: string,
        from: Dayjs,
        to: Dayjs,
        resolution: SymbolDataResolution,
    ): Promise<TimeSeriesData>


    test1234?(): void

}


