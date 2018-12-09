'use strict'

const Lucid = use('Lucid')

class Customer extends Lucid {

  user () {
    return this.belongsTo('App/Model/User')
  }

  recharges () {
    return this.hasMany('App/Model/Recharge','mobile_no','mobile_no')
  }
}

module.exports = Customer
