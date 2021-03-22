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

export interface EndOfDayData{
    date : string,
    open : number,
    high : number,
    low : number,
    close : number,
    volume : number,
    // "unadjustedVolume" : number,
    // "change" : number,
    // "changePercent" : number,
    // "vwap" : number,
    // "label" : string,
    // "changeOverTime" :number
}

export interface DataProviderInterface {

    name(): string

    fetchSupportedSymbols(): Promise<Array<AssetSymbol>>

    fetchEndOfDay?(assetSymbol :string, from : Dayjs, to : Dayjs) : Promise<EndOfDayData[]>

    test1234?(): void

}


