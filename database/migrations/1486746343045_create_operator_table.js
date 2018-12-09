'use strict'

const Schema = use('Schema')

class OperatorsTableSchema extends Schema {

  up () {
    this.create('operators', (table) => {
      table.increments()
      table.string('name')
      table.string('logo')
      table.string('balance_cr').defaultTo('0.00')
      table.string('balance_dr').defaultTo('0.00')
      table.string('balance_total').defaultTo('0.00')
      table.enum('status',['A','I','E']).defaultTo('A')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('operators')
  }

}

module.exports = OperatorsTableSchema
