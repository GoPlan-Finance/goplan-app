import {PriceHistoryItem} from "./ApplicationInterfaces";

export interface PriceAdapterInterface {
    getPrices(ticker: string);
    resolveApiResponse(json: any[]): PriceHistoryItem[];
}