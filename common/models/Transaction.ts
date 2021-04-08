import { AssetSymbol } from '.'
import { SecureObject } from './base/SecureObject'


export class Transaction extends SecureObject {

  static className = 'Transaction'

  constructor () {
    super(Transaction.className, [
      'quantity',
      'price',
      'type',
    ])
  }

  get symbol () : AssetSymbol {
    return this.get('symbol')
  }

  set symbol (value : AssetSymbol) {
    this.set('symbol', value.toPointer())
  }

  get executedAt () : Date {
    return this.get('executedAt')
  }

  set executedAt (value : Date) {
    this.set('executedAt', value)
  }

  get price () : number {
    return this.get('price') //Money.fromDecimal(Number(this.get('price')), this.get('currency'))
  }

  set price (value) {
    this.set('price', value)
  }

  get quantity () : number {
    return Number(this.get('quantity'))
  }

  set quantity (value) {
    this.set('quantity', value)
  }

  get type () : string {
    return this.get('type')
  }

  set type (value) {
    this.set('type', value.toUpperCase())
  }

  get value () : number {
    return this.price * this.quantity //this.price.multiply(this.quantity)
  }

  get currency () : string {
    return this.get('currency')
  }

  set currency (value) {
    this.set('currency', value.toUpperCase())
  }

}


Transaction.register()
