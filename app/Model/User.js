'use strict'

const Lucid = use('Lucid')
const Hash = use('Hash')

class User extends Lucid {

  static boot () {
    super.boot()

    /**
     * Hashing password before storing to the
     * database.
     */
    this.addHook('beforeCreate', function * (next) {
      this.password = yield Hash.make(this.password)
      yield next
    })
  }

  apiTokens () {
    return this.hasMany('App/Model/Token')
  }

  operators () {
    return this.hasMany('App/Model/Operator')
  }

  customers () {
    return this.hasMany('App/Model/Customer')
  }

  recharges () {
    return this.hasMany('App/Model/Recharge')
  }

  recharge_amount (user_id) {
    const recharges = this.find(user_id).recharges()
    let total = 0;
    recharges.map(c => {
      total += c.amount
    })
    return total
  }


}

module.exports = User
