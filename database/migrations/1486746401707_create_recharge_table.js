'use strict'

const Schema = use('Schema')

class RechargesTableSchema extends Schema {

  up () {
    this.create('recharges', (table) => {
      table.increments()
      table.string('mobile_no')
      table.string('amount')
      table.date('date')
      table.enum('status',['P','C','X'])
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('operator_id').unsigned().references('id').inTable('operators')
      table.timestamps()
    })
  }

  down () {
    this.drop('recharges')
  }

}

module.exports = RechargesTableSchema
