'use strict'
const Helpers = use('Helpers')

const Recharge = use('App/Model/Recharge')
const Operator = use('App/Model/Operator')
const Customer = use('App/Model/Customer')
const Database = use('Database')
const moment = require('moment')
class UserController {

    * login(request, response){

      const isLoggedIn = yield request.auth.check()
      if (isLoggedIn) {
        response.redirect('/dashboard')
      }

        if(request.input('login'))
        {
          const email = request.input('email')
          const password = request.input('password')

          try {
              yield request.auth.attempt(email, password)
              response.redirect('/dashboard')
              return;

            } catch (e) {
              yield request
                    .withAll()
                    .andWith({errors: "Invalid email/password"})
                    .flash()
              response.redirect('/login')
              return;
            }
        }

         yield response.sendView('login')
    }

    * logout(request, response){
      yield request.auth.logout()
      response.redirect('/login');
    }

    * dashboard(request, response){
        const recharges = yield request.currentUser.recharges()
        const todays_recharges = yield request.currentUser.recharges()
        const operators = yield request.currentUser.operators()
        const customers = yield request.currentUser.customers()
        const today_amount = yield Database.from('recharges').where('user_id',request.currentUser.id).andWhere('date',moment().format('YYYY-MM-DD')).sum('amount as total')
        const total_amount = yield Database.from('recharges').where('user_id',request.currentUser.id).sum('amount as total')
        const current_month = moment().format('MM')
        const current_year = moment().format('YYYY')
      //  const this_month_data = yield Database.from('recharges').where('user_id',request.currentUser.id).andWhereBetween('date',[current_year+'-'+current_month+'-01',moment().format('YYYY-MM-DD')])
        const chart_data = [];
        for (var i = 1; i <= moment().format('D'); i++) {
          let day_amount = yield Database.from('recharges').where('user_id',request.currentUser.id).andWhere('date',moment(current_year+'-'+current_month+'-'+i,'YYYY-MM-D').format('YYYY-MM-DD')).sum('amount as total')
          chart_data.push([parseInt(moment(current_year+'-'+current_month+'-'+i,'YYYY-MM-D').format('x')),day_amount[0].total || 0]);
        }

        yield response.sendView('dashboard',{ recharges , operators , customers , total_amount:total_amount[0].total , today_amount : today_amount[0].total, chart_data  })
    }
}

module.exports = UserController
