import { BaseObject, Query, QueryUtils } from '@goplan-finance/utils';
import { AssetSymbol } from './AssetSymbol';

export class AssetPrice extends BaseObject {
  static className = 'AssetPrice';

  constructor() {
    super(AssetPrice.className);
  }

  get symbol(): AssetSymbol {
    return this.get('symbol');
  }

  set symbol(value: AssetSymbol) {
    this.set('symbol', value);
  }

  get recordedAt(): Date {
    return this.get('recordedAt');
  }

  set recordedAt(value: Date) {
    this.set('recordedAt', value);
  }

  get price(): number {
    return this.get('price');
  }

  set price(value: number) {
    this.set('price', value);
  }

  get changesPercentage(): number {
    return this.get('changesPercentage');
  }

  set changesPercentage(value: number) {
    this.set('changesPercentage', value);
  }

  get change(): number {
    return this.get('change');
  }

  set change(value: number) {
    this.set('change', value);
  }

  get dayLow(): number {
    return this.get('dayLow');
  }

  set dayLow(value: number) {
    this.set('dayLow', value);
  }

  get dayHigh(): number {
    return this.get('dayHigh');
  }

  set dayHigh(value: number) {
    this.set('dayHigh', value);
  }

  get yearHigh(): number {
    return this.get('yearHigh');
  }

  set yearHigh(value: number) {
    this.set('yearHigh', value);
  }

  get yearLow(): number {
    return this.get('yearLow');
  }

  set yearLow(value: number) {
    this.set('yearLow', value);
  }

  get marketCap(): number {
    return this.get('marketCap');
  }

  set marketCap(value: number) {
    this.set('marketCap', value);
  }

  get priceAvg50(): number {
    return this.get('priceAvg50');
  }

  set priceAvg50(value: number) {
    this.set('priceAvg50', value);
  }

  get priceAvg200(): number {
    return this.get('priceAvg200');
  }

  set priceAvg200(value: number) {
    this.set('priceAvg200', value);
  }

  get volume(): number {
    return this.get('volume');
  }

  set volume(value: number) {
    this.set('volume', value);
  }

  get avgVolume(): number {
    return this.get('avgVolume');
  }

  set avgVolume(value: number) {
    this.set('avgVolume', value);
  }

  get open(): number {
    return this.get('open');
  }

  set open(value: number) {
    this.set('open', value);
  }

  get previousClose(): number {
    return this.get('previousClose');
  }

  set previousClose(value: number) {
    this.set('previousClose', value);
  }

  get eps(): number {
    return this.get('eps');
  }

  set eps(value: number) {
    this.set('eps', value);
  }

  get pe(): number {
    return this.get('pe');
  }

  set pe(value: number) {
    this.set('pe', value);
  }

  get sharesOutstanding(): number {
    return this.get('sharesOutstanding');
  }

  set sharesOutstanding(value: number) {
    this.set('sharesOutstanding', value);
  }

  static async liveQuery(
    symbol: AssetSymbol,
    fn: QueryUtils.LiveQueryUpdateFn<AssetPrice>
  ): Promise<Parse.LiveQuerySubscription> {
    const q = Query.create(AssetPrice);

    q.equalTo('symbol', symbol);
    q.descending('recordedAt');
    q.limit(1);

    const ap = await q.find();

    if (ap) {
      // load one price immediatly
      fn(ap[0], null);
    }

    return await q.liveQuery(null, fn);
  }
}

AssetPrice.register();
