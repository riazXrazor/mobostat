'use strict'

const Database = use('Database')
const Customer = use('App/Model/Customer')

class CustomerController {
  * index(request, response) {
      const get = request.get();
      const page = get.page ?  get.page : 1;
      const search = get.search;
      if(search)
      {
        const customers = yield Database.from('customers').where(Database.raw("user_id = "+request.currentUser.id+" AND mobile_no LIKE '"+search+"%'"))
        .orderBy('created_at', 'desc')
        .paginate(page)
        console.log(customers);
        yield response.sendView('customer/list',{customers : customers })
      }
      else
      {
        console.log("ok");
        const customers = yield request.currentUser.customers().orderBy('created_at', 'desc').paginate(page)
        yield response.sendView('customer/list',{customers : customers.toJSON() })
      }


  }

  * history(request, response)
  {
    const get = request.get();
    const page = get.page ?  get.page : 1;
    const customer_id = request.param('customer_id');
    const customer = yield Customer.find(customer_id);
    const recharges = yield customer.recharges().orderBy('created_at','desc').paginate(page);
    yield response.sendView('customer/history',{recharges : recharges.toJSON(),customer : customer.toJSON() })
  }
}

module.exports = CustomerController
