'use strict'

const Helpers = use('Helpers')
const Operator = use('App/Model/Operator')
const OperatorRefill = use('App/Model/OperatorRefill')
const fs = require('fs');
class OperatorController {

  * index(request, response) {
      const operators = yield Operator.all();
      //console.log(operators.toJSON());
        yield response.sendView('operator/list',{operators : operators.toJSON() })
  }

  * create(request, response) {
      yield response.sendView('operator/add')
  }

  * store(request, response) {
    const name = request.input('name')
    const logo = request.file('logo', {
         maxSize: '10mb',
         allowedExtensions: ['jpg', 'png', 'jpeg']
     })

    const balance = request.input('balance')
    const fileName = `${name}-${request.currentUser.id}.${logo.extension()}`

    yield logo.move(Helpers.publicPath('uploads'), fileName.toLowerCase())
    if (!logo.moved()) {
      yield request
            .withAll()
            .andWith({error : logo.errors().toString()})
            .flash()
      response.redirect('back')
      return;
    }


    const operator = new Operator()
    operator.name = name
    operator.logo = logo.uploadName()
    operator.balance_total =  parseFloat(balance)
    operator.balance_cr =  parseFloat(balance)
    operator.status = 'A'
    operator.user_id = request.currentUser.id
    yield operator.save();

    yield request
          .with({success: "New operator created !!"})
          .flash()
    response.redirect('back')
  }

  * refill(request, response) {
    const id = request.param('id')
    const balance = request.input('balance')
    const operator = yield Operator.find(id)
    const refills = yield OperatorRefill.all()
    if(request.input('refill'))
    {
      operator.balance_total = parseFloat(operator.balance_total) + parseFloat(balance)
      operator.balance_cr = parseFloat(operator.balance_total)
      operator.balance_dr = 0
      yield operator.save();

      const refill = new OperatorRefill();
        refill.amount = parseFloat(balance)
        refill.operator_id = operator.id
        yield refill.save()

      yield request
            .with({success: "operator refilled !!"})
            .flash()
      response.redirect('/operator')
    }

     yield response.sendView('operator/refill',{operator : operator.toJSON(), refills : refills.toJSON() })
  }

  * edit(request, response) {
        const id = request.param('id')
        const operator = yield Operator.find(id)
        yield response.sendView('operator/edit',{operator : operator.toJSON() })
  }

  * update(request, response) {
    const id = request.param('id')
    const name = request.input('name')

    const logo = request.file('logo', {
         maxSize: '10mb',
         allowedExtensions: ['jpg', 'png', 'jpeg']
     })
    const balance = request.input('balance')

    const operator = yield Operator.find(id)

    if(logo.clientName()){
      const fileName = `${name}-${request.currentUser.id}.${logo.extension()}`
      fs.unlinkSync(Helpers.publicPath(`uploads/${operator.logo}`))
      yield logo.move(Helpers.publicPath('uploads'), fileName.toLowerCase())
      if (!logo.moved()) {
        yield request
              .withAll()
              .andWith({error : logo.errors().toString()})
              .flash()
        response.redirect('back')
        return;
      }
   }


        operator.name = name
        if(logo.clientName())
          operator.logo = logo.uploadName()
        operator.balance_total =  parseFloat(balance)
        operator.balance_cr =  parseFloat(balance)
        operator.balance_dr = 0
        yield operator.save();

        yield request
              .with({success: "operator updated !!"})
              .flash()
        response.redirect('back')
  }

  * destroy(request, response) {
    const id = request.param('id')
    const operator = yield Operator.find(id)
    fs.unlinkSync(Helpers.publicPath(`uploads/${operator.logo}`))
    yield operator.delete();
    yield request
          .with({success: "Operator deleted !!"})
          .flash()
    response.redirect('back');
  }

}

module.exports = OperatorController
