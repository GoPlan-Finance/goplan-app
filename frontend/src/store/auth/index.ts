import VueStore from 'vue-class-store'
// const Parse = require('parse')


@VueStore
export class AuthStore {
    // properties are rebuilt as reactive data values
    public value: number

    // getters are converted to (cached) computed properties
    public get double(): number {
        return this.value * 2
    }


    public async  currentUser(): Promise<Parse.User> {

        return await Parse.User.currentAsync()
    }


    public async  isAuthenticated(): Promise<boolean> {

        return !! await Parse.User.currentAsync()
    }


    // constructor parameters serve as props
    constructor(value: number = 1) {
        // constructor function serves as the created hook
        this.value = value
    }

    // prefix properties with `on:` to convert to watches
    'on:value'() {
        console.log('value changed to:', this.value)
    }

    // class methods are added as methods
    log() {
        console.log('value is:', this.value)
    }
}
