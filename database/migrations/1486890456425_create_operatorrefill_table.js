'use strict'

const Schema = use('Schema')

class OperatorRefillsTableSchema extends Schema {

  up () {
    this.create('operator_refills', (table) => {
      table.increments()
      table.integer('operator_id').unsigned().references('id').inTable('operators')
      table.string('amount')
      table.timestamps()
    })
  }

  down () {
    this.drop('operator_refills')
  }

}

module.exports = OperatorRefillsTableSchema
