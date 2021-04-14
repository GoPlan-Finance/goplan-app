import { AssetPrice, AssetSymbol } from '.'
import { SecureObject } from './base/SecureObject'


export type TransactionType = 'transfer' | 'buy' | 'sell' | 'dividends' | 'fees'


export class Holding extends SecureObject {

  static className = 'Holding'

  private _lastPrice :AssetPrice = null

  constructor () {
    super(Holding.className, [])
  }

  get symbol () : AssetSymbol {
    return this.get('symbol')
  }

  set symbol (value : AssetSymbol) {
    this.set('symbol', value)
  }

  get symbolName () : string {
    return this.get('symbolName')
  }

  set symbolName (value : string) {
    this.set('symbolName', value)
  }


  get lastPrice () : AssetPrice {
    return this._lastPrice
  }

  set lastPrice (value : AssetPrice) {
    this._lastPrice = value
  }

  get lastBuy () : Date {
    return this.get('lastBuy')
  }

  set lastBuy (value : Date) {
    this.set('lastBuy', value)
  }


  get lastBuyAt () : Date {
    return this.get('lastBuyAt')
  }

  set lastBuyAt (value : Date) {
    this.set('lastBuyAt', value)
  }

  get lastSellAt () : Date {
    return this.get('lastSellAt')
  }

  set lastSellAt (value : Date) {
    this.set('lastSellAt', value)
  }

  get currency () : string {
    return this.get('currency')
  }

  set currency (value) {
    this.set('currency', value ? value.toUpperCase() : null)
  }

  get openQty () : number {
    return this.get('openQty')
  }

  set openQty (value : number) {
    this.set('openQty', value)
  }

  get openAvgPrice () : number {
    return this.get('openAvgPrice')
  }

  set openAvgPrice (value : number) {
    this.set('openAvgPrice', value)
  }


  get openTotalPrice () : number {
    return this.get('openTotalPrice')
  }

  set openTotalPrice (value : number) {
    this.set('openTotalPrice', value)
  }


  get closedQty () : number {
    return this.get('closedQty')
  }

  set closedQty (value : number) {
    this.set('closedQty', value)
  }

  get closedAvgPrice () : number {
    return this.get('closedAvgPrice')
  }

  set closedAvgPrice (value : number) {
    this.set('closedAvgPrice', value)
  }


  get closedTotalPrice () : number {
    return this.get('closedTotalPrice')
  }

  set closedTotalPrice (value : number) {
    this.set('closedTotalPrice', value)
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


Holding.register()
