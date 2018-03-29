'use strict'

const path = require('path')
const proxyquire = require('proxyquire')
const lodash = require('lodash')
const sinon = require('sinon')
const {expect} = require('chai')

const DirectDebitGatewayAccount = require('../../../app/models/DirectDebitGatewayAccount.class')
let req, res, next, connectorGetAccountMock, directDebitConnectorGetAccountMock

const connectorMock = {
  ConnectorClient: function () {
    this.getAccount = connectorGetAccountMock
  }
}
const setupGetGatewayAccount = function (currentGatewayAccountID, paymentProvider) {
  const authServiceMock = {getCurrentGatewayAccountId: () => currentGatewayAccountID}
  req = {
    correlationId: 'sdfghjk'
  }
  res = {
    redirect: sinon.spy()
  }
  next = sinon.spy()
  connectorGetAccountMock = sinon.spy((params) => {
    return Promise.resolve({
      id: params.gatewayAccountId,
      payment_provider: paymentProvider
    })
  })
  directDebitConnectorGetAccountMock = sinon.spy((params) => {
    return Promise.resolve(new DirectDebitGatewayAccount({
      gateway_account_id: '3',
      gateway_account_external_id: params.gatewayAccountId,
      payment_provider: paymentProvider,
      type: 'test'
    }))
  })
  const directDebitConnectorMock = {
    gatewayAccount: {
      get: directDebitConnectorGetAccountMock
    }
  }

  return proxyquire(path.join(__dirname, '../../../app/middleware/get_gateway_account'), {
    '../services/auth_service.js': authServiceMock,
    '../services/clients/connector_client.js': connectorMock,
    '../services/clients/direct_debit_connector_client.js': directDebitConnectorMock
  })
}

describe('middleware: getGatewayAccount', () => {
  it('should call connectorClient.getAccount if it can resolve a currentGatewayAccountId', done => {
    lodash.set(req, 'user.serviceRoles[0]', {gatewayAccountIds: ['1', '2', '3']})
    const getGatewayAccount = setupGetGatewayAccount('1', 'worldpay')
    getGatewayAccount(req, res, next).then(() => {
      expect(connectorGetAccountMock.called).to.equal(true)
      expect(connectorGetAccountMock.calledWith({gatewayAccountId: '1', correlationId: 'sdfghjk'})).to.equal(true)
      expect(next.called).to.equal(true)
      expect(res.redirect.called).to.equal(false)
      done()
    })
  })
  it('should extend the account data with supports3ds set to true if the account type is worldpay', done => {
    lodash.set(req, 'user.serviceRoles[0]', {gatewayAccountIds: ['1', '2', '3']})
    const getGatewayAccount = setupGetGatewayAccount('1', 'worldpay')
    getGatewayAccount(req, res, next).then(() => {
      expect(req.account).to.deep.equal({id: '1', payment_provider: 'worldpay', supports3ds: true})
      done()
    })
  })
  it('should extend the account data with supports3ds set to false if the account type is epdq and feature flag default disabled', done => {
    lodash.set(req, 'user.serviceRoles[0]', {gatewayAccountIds: ['1', '2', '3']})
    const getGatewayAccount = setupGetGatewayAccount('1', 'epdq')
    getGatewayAccount(req, res, next).then(() => {
      expect(req.account).to.deep.equal({id: '1', payment_provider: 'epdq', supports3ds: false})
      done()
    })
  })
  it('should extend the account data with supports3ds set to true if the account type is epdq and feature flag enabled', done => {
    process.env.EPDQ_3DS_ENABLED = 'true'
    lodash.set(req, 'user.serviceRoles[0]', {gatewayAccountIds: ['1', '2', '3']})
    const getGatewayAccount = setupGetGatewayAccount('1', 'epdq')
    getGatewayAccount(req, res, next).then(() => {
      expect(req.account).to.deep.equal({id: '1', payment_provider: 'epdq', supports3ds: true})
      done()
    })
  })
  it('should not extend the account data with supports3ds set to false if the account type is smartpay and feature flag disabled', done => {
    lodash.set(req, 'user.serviceRoles[0]', {gatewayAccountIds: ['1', '2', '3']})
    const getGatewayAccount = setupGetGatewayAccount('1', 'smartpay')
    getGatewayAccount(req, res, next).then(() => {
      expect(req.account).to.deep.equal({id: '1', payment_provider: 'smartpay', supports3ds: false})
      done()
    })
  })
  it('should extend the account data with supports3ds set to true if the account type is smartpay and feature flag enabled', done => {
    process.env.SMARTPAY_3DS_ENABLED = 'true'
    lodash.set(req, 'user.serviceRoles[0]', {gatewayAccountIds: ['1', '2', '3']})
    const getGatewayAccount = setupGetGatewayAccount('1', 'smartpay')
    getGatewayAccount(req, res, next).then(() => {
      expect(req.account).to.deep.equal({id: '1', payment_provider: 'smartpay', supports3ds: true})
      done()
    })
  })
  it('should call direct debit connector if the token is a direct debit token', done => {
    lodash.set(req, 'user.serviceRoles[0]', {gatewayAccountIds: ['DIRECT_DEBIT:1sadasd']})
    const getGatewayAccount = setupGetGatewayAccount('DIRECT_DEBIT:1sadasd', 'sandbox')
    getGatewayAccount(req, res, next).then(() => {
      expect(directDebitConnectorGetAccountMock.called).to.equal(true)
      expect(directDebitConnectorGetAccountMock.calledWith({gatewayAccountId: 'DIRECT_DEBIT:1sadasd', correlationId: 'sdfghjk'})).to.equal(true)
      expect(next.called).to.equal(true)
      expect(res.redirect.called).to.equal(false)
      done()
    })
  })
})
