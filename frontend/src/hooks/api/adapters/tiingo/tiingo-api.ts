import {TiingoApiPriceResponse} from "./tiingo-interfaces";
import {PriceHistoryItem} from "../../interfaces/goplan-interfaces";
import {PriceAdapterInterface} from "../../interfaces/adapter-interfaces";

export class TiingoApiAdapter implements PriceAdapterInterface {
    async getPrices(ticker: string) {
        let response = await fetch("./tiingo.json");

        return await response.json() as TiingoApiPriceResponse[];
    }

    resolveApiResponse(json: any[]): PriceHistoryItem[] {
        let priceHistoryItems: PriceHistoryItem[] = [];

        json.forEach(item => {
            let priceHistoryItem: PriceHistoryItem = {
                close: item.close,
                date: item.date,
                divCash: item.divCash,
                high: item.high,
                low: item.low,
                open: item.open,
                splitFactor: item.splitFactor,
                volume: item.volume
            }
            priceHistoryItems.push(priceHistoryItem);
        })

        return priceHistoryItems;
    }
}
