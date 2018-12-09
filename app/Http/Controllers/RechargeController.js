'use strict'

const Helpers = use('Helpers')
const Recharge = use('App/Model/Recharge')
const Operator = use('App/Model/Operator')
const Customer = use('App/Model/Customer')
const moment = require('moment')
const Database = use('Database')

class RechargeController {

  * index(request, response) {
      const get = request.get();
      const page = get.page ?  get.page : 1;
      const search = get.search;
      const operators = yield request.currentUser.operators()
      const customers = yield request.currentUser.customers()




      if(request.input('recharge'))
      {
         const mobile = request.input('mobile')
         const amount = request.input('amount')
         const operator_id = request.input('operator')

         const recharge  = new Recharge()
         recharge.mobile_no = mobile
         recharge.amount = parseFloat(amount)
         recharge.date = moment().format('YYYY-MM-DD')
         recharge.operator_id = operator_id;
         recharge.user_id = request.currentUser.id
         recharge.status = 'P'
         const s = yield recharge.save();

         if(s)
         {
           const operator = yield Operator.find(operator_id)
           operator.balance_cr = parseFloat(operator.balance_cr) - parseFloat(amount)
           operator.balance_dr = parseFloat(operator.balance_dr) + parseFloat(amount)
           yield operator.save()
           try{
              const customer = yield Customer.findByOrFail('mobile_no', mobile)
           } catch (e) {
               const customer = new Customer()
               customer.mobile_no = mobile
               customer.date = moment().format('YYYY-MM-DD')
               customer.user_id = request.currentUser.id
               yield customer.save()
           }
         }

             yield request
                   .with({success: "Recharge successfull !!"})
                   .flash()
            response.redirect('back');
      }

      if(request.input('update'))
      {
        const id = request.input('id')
        const status = request.input('status')
        const recharge = yield Recharge.find(id)
        recharge.status = status;
        yield recharge.save();
        yield request
              .with({success: "Updated successful !!"})
              .flash()
              response.redirect('back');
      }

      if(search)
      {
        var recharges = yield Database.from('recharges').where(Database.raw("user_id = "+request.currentUser.id+" AND mobile_no LIKE '"+search+"%'"))
        .orderBy('created_at', 'desc')
        .paginate(page)
        yield response.sendView('recharge/add',{recharges : recharges, operators : operators,customers : customers, page : page })
      }
      else
      {
          var recharges = yield request.currentUser.recharges().orderBy('created_at', 'desc').paginate(page)
          yield response.sendView('recharge/add',{recharges : recharges.toJSON(), operators : operators,customers : customers, page : page })
      }


  }
}

module.exports = RechargeController
