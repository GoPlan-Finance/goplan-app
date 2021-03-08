import {PriceHistoryItem} from "../../../interfaces/ApplicationInterfaces";
import {PriceAdapterInterface} from "../../../interfaces/AdapterInterfaces";

interface TiingoApiPriceResponse {
    date: Date;
    close: number;
    high: number;
    low: number;
    open: number;
    volume: number;
    adjClose: number;
    adjHigh: number;
    adjLow: number;
    adjOpen: number;
    adjVolume: number;
    divCash: number;
    splitFactor: number;
}

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
