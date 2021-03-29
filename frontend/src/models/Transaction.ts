import {SecureObject} from './base/SecureObject'


export class Transaction extends SecureObject {

    static className = 'Transaction'

    constructor () {
      super(Transaction.className, [
        'quantity',
        'price',
        'type',
      ])
    }

}

Transaction.register()
