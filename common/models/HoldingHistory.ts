import { AssetSymbol, Holding } from '.'
import { SecureObject } from './base/SecureObject'


export class HoldingHistory extends SecureObject {

  static className = 'HoldingHistory'


  constructor () {
    super(HoldingHistory.className, [
      'low',
      'high',

      'open',
      'close',

      'openQty',
    ])
  }

  get holding () : Holding {
    return this.get('holding')
  }

  set holding (value : Holding) {
    this.set('holding', value)
  }

  get symbol () : AssetSymbol {
    return this.get('symbol')
  }

  set symbol (value : AssetSymbol) {
    this.set('symbol', value)
  }

  get symbolName () : string {

    if (this.symbol && this.symbol.tickerName) {
      return this.symbol.tickerName
    }

    return this.get('symbolName')
  }

  set symbolName (value : string) {
    this.set('symbolName', value)
  }

  get currency () : string {
    return this.get('currency')
  }

  set currency (value : string) {
    this.set('currency', value ? value.toUpperCase() : null)
  }

  get isOutdated () : boolean {
    return this.get('isOutdated')
  }

  set isOutdated (value : boolean) {
    this.set('isOutdated', value)
  }

  get startAt () : Date {
    return this.get('startAt')
  }

  set startAt (value : Date) {
    this.set('startAt', value)
  }

  get endAt () : Date {
    return this.get('endAt')
  }

  set endAt (value : Date) {
    this.set('endAt', value)
  }

  get period () : string {
    return this.get('period')
  }

  set period (value : string) {
    this.set('period', value)
  }

  get openQty () : number {
    return this.get('openQty')
  }

  set openQty (value : number) {
    this.set('openQty', value)
  }

  get low () : number {
    return this.get('low')
  }

  set low (value : number) {
    this.set('low', value)
  }

  get high () : number {
    return this.get('high')
  }

  set high (value : number) {
    this.set('high', value)
  }

  get open () : number {
    return this.get('open')
  }

  set open (value : number) {
    this.set('open', value)
  }

  get close () : number {
    return this.get('close')
  }

  set close (value : number) {
    this.set('close', value)
  }


  //
  // get  () : number {
  //   return this.get('')
  // }
  //
  // set (value :number ){
  //   this.set('' , value)
  // }


}


HoldingHistory.register()
