import {PriceHistoryItem} from "./goplan-interfaces";

export interface PriceAdapterInterface {
    getPrices(ticker: string);
    resolveApiResponse(json: any[]): PriceHistoryItem[];
}