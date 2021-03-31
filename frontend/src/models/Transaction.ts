import {SecureObject} from './base/SecureObject'
import {AssetSymbol} from '../../../common/models'
import {Currencies, Currency, Money } from 'ts-money'


export class Transaction extends SecureObject {

    static className = 'Transaction'

    constructor () {
      super(Transaction.className, [
        'quantity',
        'price',
        'type',
      ])
    }

    get symbol (): AssetSymbol {
      return this.get('symbol')
    }
    get date (): Date {
      return this.get('date')
    }
    get price (): Money {
      return Money.fromDecimal(Number(this.get('price')), Currencies.USD)
    }
    get quantity (): number {
      return Number(this.get('quantity'))
    }
    get type (): string {
      return this.get('type')
    }

    get value (): Money {
      return this.price.multiply(this.quantity)
    }

    get currency (): string {
      return this.price.getCurrencyInfo().symbol
    }

}

Transaction.register()
