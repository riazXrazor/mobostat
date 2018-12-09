'use strict'

const Schema = use('Schema')

class CustomersTableSchema extends Schema {

  up () {
    this.create('customers', (table) => {
      table.increments()
      table.string('mobile_no',15).unique()
      table.date('date')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('customers')
  }

}

module.exports = CustomersTableSchema
