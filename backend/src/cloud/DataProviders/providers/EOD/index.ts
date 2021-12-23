/**
 *
 *
 *
 */
import { ProcessUtils } from '@goplan-finance/utils';
import { Mutex } from 'async-mutex';
import { AxiosError } from 'axios';

import dayjs from 'dayjs';
import * as EODApi from 'eodhistoricaldata-openapi';
import { AssetQuote, Period } from 'eodhistoricaldata-openapi';
import * as Types from '../types';
import { CompanyQuote, EndOfDayData } from '../types';
import { SymbolDataResolution } from '@common/types/types';

export class EOD implements Types.DataProviderInterface {
  private readonly config: EODApi.Configuration;
  mutex = new Mutex();
  throttleRequestQuotaMs = 0;

  constructor(apiKey: string) {
    this.config = new EODApi.Configuration({
      apiKey,
    });
  }

  private static handleError(error: AxiosError): void {
    const response = error.response;

    if (response.status === 429) {
      // X-RateLimit-Limit: 2000
      // X-RateLimit-Remaining: 1994
      // const s  = response.data['X-Rate-Limit-Retry-After-Seconds'] || 0
      // const ms = response.data['X-Rate-Limit-Retry-After-Milliseconds'] || 0
      // const err             = new Types.APIError(Types.APIErrorType.QUOTA_ERROR)
      // err.retryAfterSeconds = s + (ms / 1000.0)
      // throw err
    }

    throw new Types.APIError(Types.APIErrorType.UNKNOWN_ERROR, response);
  }

  async fetchSupportedExchanges(): Promise<Array<Types.Exchange>> {
    const listApi = new EODApi.ExchangesApi(this.config);

    const response = await listApi.listExchanges();

    const exchanges: Types.Exchange[] = [];

    for (const exchange of response.data) {
      exchanges.push({
        currency: exchange.Currency,
        code: exchange.Code,
        country: exchange.Country,
        name: exchange.Name,
      });
    }

    return exchanges;
  }

  async fetchSupportedSymbols(): Promise<Array<Types.AssetSymbol>> {
    const listApi = new EODApi.ExchangesApi(this.config);
    const assets: Array<Types.AssetSymbol> = [];

    const exchanges = await this.fetchSupportedExchanges();

    console.log(`Found ${exchanges.length} exchanges`);
    await ProcessUtils.processBatch(
      exchanges,
      async (exchange: Types.Exchange) => {
        console.log(`Getting symbols for  ${exchange.code}`);
        const response = await listApi.listSymbols(exchange.code);

        for (const asset of response.data) {
          assets.push({
            currency: asset.Currency,
            symbol: asset.Code,
            exchange: asset.Exchange,
            name: asset.Name,
            type: asset.Type,
            ISIN: asset.Isin,
          });
        }
      },
      null,
      4
    );

    return assets;
  }

  async searchSymbols(query: string): Promise<Array<Types.AssetSymbol>> {
    const listApi = new EODApi.AssetsApi(this.config);

    const response = await listApi.searchAsset(query);

    const assets: Array<Types.AssetSymbol> = [];

    for (const asset of response.data) {
      assets.push({
        currency: asset.Currency,
        symbol: asset.Code,
        exchange: asset.Exchange,
        name: asset.Name,
        type: asset.Type,
        ISIN: asset.ISIN,
      });
    }

    return assets;
  }

  async fetchSymbolTimeSeriesData(
    symbol: string,
    from: dayjs.Dayjs,
    to: dayjs.Dayjs,
    resolution: SymbolDataResolution
  ): Promise<Types.TimeSeriesData> {
    const assetApi = new EODApi.AssetsApi(this.config);

    let period = Period.D;
    switch (resolution) {
      case '1minute':
      case '5minutes':
      case '30minutes':
      case '15minutes':
      case 'hour':
      case '4hours':
      case 'day':
        period = Period.D;
        break;
      case 'week':
        period = Period.W;
        break;
      case 'month':
        period = Period.M;
        break;
      default:
        throw `Resolution ${resolution} not implemented`;
    }

    const response = await assetApi.endOfDayHistorical(
      symbol,
      period,
      from.toISOString(),
      to.toISOString()
    );

    const endOfDayData: EndOfDayData[] = response.data.map(item => {
      const ratio = item.adjusted_close / item.close;
      return {
        date: item.date,
        open: +(item.open * ratio).toFixed(3),
        high: +(item.high * ratio).toFixed(3),
        low: +(item.low * ratio).toFixed(3),
        close: +item.adjusted_close.toFixed(3),
        volume: item.volume,
      };
    });

    return {
      data: endOfDayData,
      resolution,
    };
  }

  async getCompanyProfile(tickerName: string): Promise<Types.CompanyProfile> {
    try {
      const assetApi = new EODApi.AssetsApi(this.config);

      const response = await assetApi.assetFundamentalsGeneralSection(tickerName);
      const general = response.data;
      return {
        symbol: general.Code,
        companyName: general.Name,
        currency: general.CurrencyCode,
        isin: general.ISIN,
        cusip: general.CUSIP,
        exchangeCode: general.Exchange,
        industry: general.Industry,
        website: general.WebURL,
        description: general.Description,
        sector: general.Sector,
        country: general.CountryISO,
        fullTimeEmployees: general.FullTimeEmployees,
        phone: general.Phone,
        address: general.AddressData?.Street,
        city: general.AddressData?.City,
        state: general.AddressData?.State,
        zip: general.AddressData?.ZIP,
        image:
          general.LogoURL && general.LogoURL.toLowerCase().startsWith('http')
            ? general.LogoURL
            : `https://eodhistoricaldata.com${general.LogoURL}`,
        ipoDate: general.IPODate,
      };
    } catch (error) {
      EOD.handleError(error);
    }
  }

  async getCompanyQuote(symbol: string): Promise<Types.CompanyQuote> {
    const quotes = await this.getCompanyQuotes([symbol]);

    return quotes[0];
  }

  public name(): string {
    return 'EOD';
  }

  async getCompanyProfiles(symbols: string[]): Promise<Types.CompanyProfile[]> {
    const promises = await Object.values(symbols).map(
      async symbol => await this.getCompanyProfile(symbol)
    );

    return await Promise.all(promises);
  }

  mapAssetQuoteToCompanyQuote(quote: AssetQuote): CompanyQuote {
    return {
      avgVolume: 0,
      earningsAnnouncement: '',
      eps: 0,
      exchange: '',
      marketCap: 0,
      name: '',
      pe: 0,
      price: 0,
      priceAvg200: 0,
      priceAvg50: 0,
      yearHigh: 0,
      yearLow: 0,
      symbol: quote.code,
      changesPercentage: quote.change_p,
      change: quote.change,
      dayLow: quote.low,
      dayHigh: quote.high,
      volume: quote.volume,
      open: quote.open,
      previousClose: quote.previousClose,
      timestamp: quote.timestamp,
    };
  }

  async getCompanyQuotes(symbols: string[]): Promise<CompanyQuote[]> {
    const api = new EODApi.AssetsApi(this.config);

    const responseRealTime = await api.realTimeQuote(symbols.pop(), symbols.join(','));

    let quotes: AssetQuote | AssetQuote[] = responseRealTime.data;
    // console.log('quote', quote);
    if (!Array.isArray(quotes)) {
      quotes = [quotes];
    }
    return quotes.map(quote => this.mapAssetQuoteToCompanyQuote(quote));
  }
}
