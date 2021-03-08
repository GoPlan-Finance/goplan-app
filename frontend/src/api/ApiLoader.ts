import {PriceHistoryItem} from "../interfaces/ApplicationInterfaces";
import {TiingoApiAdapter} from "./adapters/tiingo/TiingoApi";
import {PriceAdapterInterface} from "./AdapterInterfaces";

export enum ApiAdapters {
    TIINGO = 'tiingo'
}

class ApiLoader {
    defaultAdapter = ApiAdapters.TIINGO;

    async getPrices(
        ticker: string,
        adapter: ApiAdapters = this.defaultAdapter
    ): Promise<PriceHistoryItem[]> {
        let adapterInterface = ApiLoader.getAdapter(adapter);
        return adapterInterface.loadPricesFromApi(ticker);
    }

    resolveApiResponse(
        prices: any[],
        adapter: ApiAdapters = this.defaultAdapter
    ): PriceHistoryItem[] {
        let adapterInterface = ApiLoader.getAdapter(adapter);
        return adapterInterface.resolvePriceApiResponse(prices);
    }

    private static getAdapter(adapter: ApiAdapters): PriceAdapterInterface {
        let mapping: Record<ApiAdapters, any> = {
            [ApiAdapters.TIINGO]: new TiingoApiAdapter()
        }

        return mapping[adapter];
    }
}

export const apiLoader = new ApiLoader();