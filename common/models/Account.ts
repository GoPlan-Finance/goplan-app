import { SecureObject } from './base/SecureObject'


export class Account extends SecureObject {

  static className = 'Account'

  constructor () {
    super(Account.className, [
      'name',
    ])
  }

  get name ()
    :
    string {
    return this.get('name')
  }

  set name (value : string) {
    this.set('name', value)
  }

  get currency ()
    :
    string {
    return this.get('currency')
  }

  set currency (value : string) {
    this.set('currency', value.toUpperCase())
  }

}


Account.register()
