'use strict'

// Local Dependencies
const {response} = require('../utils/response.js')
const paths = require('../paths')
const productsClient = require('../services/clients/products_client.js')
const publicAuthClient = require('../services/clients/public_auth_client')
const auth = require('../services/auth_service.js')

const amountFormat = /^([0-9]+)(?:\.([0-9]{2}))?$/

module.exports.index = function (req, res) {
  let params = {
    productsTab: false,
    createPage: paths.prototyping.demoService.create,
    indexPage: paths.prototyping.demoService.index,
    linksPage: paths.prototyping.demoService.links
  }

  response(req, res, 'dashboard/demo-service/index', params)
}

module.exports.links = function (req, res) {
  const gatewayAccountId = auth.getCurrentGatewayAccountId(req)

  let params = {
    productsTab: true,
    createPage: paths.prototyping.demoService.create,
    indexPage: paths.prototyping.demoService.index,
    linksPage: paths.prototyping.demoService.links
  }

  productsClient.product.getByGatewayAccountId(gatewayAccountId)
    .then(products => {
      params.productsLength = products.length
      params.productsSingular = products.length === 1
      products.forEach(function (product) {
        product.price = (product.price / 100).toFixed(2)
      })
      console.log(products)
      params.products = products
      return response(req, res, 'dashboard/demo-service/index', params)
    })
    .catch(error => {
      console.log(error)
      return response(req, res, 'dashboard/demo-service/index', params)
    })
}

module.exports.disable = function (req, res) {
  const productExternalId = req.params.productExternalId

  productsClient.product.disable(productExternalId)
  .then(() => {
    req.flash('genericError', '<p>Prototype link deleted</p>')
    res.redirect(paths.prototyping.demoService.links)
  })
  .catch(error => {
    req.flash('genericError', error)
    res.redirect(paths.prototyping.demoService.disable)
  })
}

module.exports.create = function (req, res) {
  let params = {
    indexPage: paths.prototyping.demoService.index,
    confirmPage: paths.prototyping.demoService.confirm,
    linksPage: paths.prototyping.demoService.links
  }

  response(req, res, 'dashboard/demo-service/create', params)
}

module.exports.submit = function (req, res) {
  const params = {
    indexPage: paths.prototyping.demoService.index,
    confirmPage: paths.prototyping.demoService.confirm,
    linksPage: paths.prototyping.demoService.links
  }
  const amountFormatCheck = amountFormat.exec(req.body['payment-amount'])
  const gatewayAccountId = auth.getCurrentGatewayAccountId(req)
  let price = req.body['payment-amount']

  if (!amountFormatCheck) {
    req.flash('genericError', '<h2>Use valid characters only</h2> Choose an amount in pounds and pence using digits and a decimal point. For example “10.50”')
    return res.redirect(paths.prototyping.demoService.create)
  } else {
    price = parseInt(amountFormatCheck[1]) * 100
    if (amountFormatCheck[2]) price += parseInt(amountFormatCheck[2])
  }

  publicAuthClient.createTokenForAccount({
    accountId: gatewayAccountId,
    correlationId: req.correlationId,
    payload: {
      account_id: gatewayAccountId,
      created_by: req.user.email,
      description: `Token for Prototype: ${req.body['payment-description']}`
    }})
    .then(publicAuthData => productsClient.product.create({
      payApiToken: publicAuthData.token,
      gatewayAccountId,
      name: req.body['payment-description'],
      returnUrl: req.body['confirmation-page'],
      price
    }))
    .then(product => {
      params.prototypeLink = product.links.pay.href
      return response(req, res, 'dashboard/demo-service/confirm', params)
    })
    .catch(error => {
      req.flash('genericError', `<h2>There were errors</h2> ${error}`)
      return res.redirect(paths.prototyping.demoService.create)
    })
}
