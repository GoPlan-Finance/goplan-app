import {PriceHistoryItem} from '../interfaces/ApplicationInterfaces'

export interface PriceAdapterInterface {
    // eslint-disable-next-line  no-unused-vars
    loadPricesFromApi(ticker: string): Promise<any>;
    // eslint-disable-next-line  no-unused-vars
    resolvePriceApiResponse(json: any[]): PriceHistoryItem[];
}
