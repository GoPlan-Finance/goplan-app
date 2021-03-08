import {PriceHistoryItem} from "../interfaces/ApplicationInterfaces";

export interface PriceAdapterInterface {
    loadPricesFromApi(ticker: string): Promise<any>;
    resolvePriceApiResponse(json: any[]): PriceHistoryItem[];
}