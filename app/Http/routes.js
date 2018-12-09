'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/


const Route = use('Route')

Route.get('/', 'UserController.login')
Route.get('/login', 'UserController.login')
Route.post('/login', 'UserController.login')


Route.group('authenticated', function () {


          Route.get('/dashboard','UserController.dashboard');

          Route.get('customer', 'CustomerController.index')
          Route.get('customer/history/:customer_id', 'CustomerController.history')

          Route.get('recharge', 'RechargeController.index')
          Route.post('recharge', 'RechargeController.index')
          Route.put('recharge', 'RechargeController.index')

          Route.get('operator', 'OperatorController.index')
          Route.get('operator/add', 'OperatorController.create')
          Route.get('operator/refill/:id', 'OperatorController.refill')
          Route.post('operator/refill/:id', 'OperatorController.refill')
          Route.get('operator/edit/:id', 'OperatorController.edit')
          Route.post('operator/edit/:id', 'OperatorController.update')
          Route.post('operator/add', 'OperatorController.store')
          Route.delete('operator/:id', 'OperatorController.destroy')


          Route.get('logout', 'UserController.logout')

}).middleware('auth')
