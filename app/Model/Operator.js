'use strict'

const Lucid = use('Lucid')

class Operator extends Lucid {

  user () {
    return this.belongsTo('App/Model/User')
  }
}

module.exports = Operator
