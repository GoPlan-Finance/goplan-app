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

/**
 *
 * @export
 * @interface CompanyProfile
 */
export interface CompanyProfile {
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    symbol: string;
    /**
     *
     * @type {number}
     * @memberof CompanyProfile
     */
    price: number;
    /**
     *
     * @type {number}
     * @memberof CompanyProfile
     */
    beta?: number;
    /**
     *
     * @type {number}
     * @memberof CompanyProfile
     */
    volAvg?: number;
    /**
     *
     * @type {number}
     * @memberof CompanyProfile
     */
    mktCap?: number;
    /**
     *
     * @type {number}
     * @memberof CompanyProfile
     */
    lastDiv?: number;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    range?: string;
    /**
     *
     * @type {number}
     * @memberof CompanyProfile
     */
    changes?: number;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    companyName: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    currency: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    isin?: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    cusip?: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    exchange: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    exchangeShortName: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    industry: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    website?: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    description: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    ceo?: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    sector: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    country?: string;
    /**
     *
     * @type {number}
     * @memberof CompanyProfile
     */
    fullTimeEmployees?: number;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    phone?: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    address?: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    city?: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    state?: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    zip?: string;
    /**
     *
     * @type {number}
     * @memberof CompanyProfile
     */
    dcfDiff?: number;
    /**
     *
     * @type {number}
     * @memberof CompanyProfile
     */
    dcf?: number;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    image?: string;
    /**
     *
     * @type {string}
     * @memberof CompanyProfile
     */
    ipoDate?: string;
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


    getCompanyProfile?(
        symbol: string
    ) : Promise<CompanyProfile>


    test1234?(): void

}


