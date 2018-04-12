'use strict'

const q = require('q')
const requestLogger = require('../../utils/request_logger')
const baseClient = require('./old_base_client')
const User = require('../../models/User.class')
const Service = require('../../models/Service.class')
const createCallbackToPromiseConverter = require('../../utils/response_converter').createCallbackToPromiseConverter

const SERVICE_NAME = 'adminusers'
const HEADER_USER_CONTEXT = 'GovUkPay-User-Context'
const ADMINUSERS_URL = process.env.ADMINUSERS_URL

/**
 * @private
 * @param body
 */
const responseBodyToUserTransformer = body => new User(body)
const responseBodyToUserListTransformer = body => body.map(userData => new User(userData))
const responseBodyToServiceTransformer = body => new Service(body)

module.exports = function (clientOptions = {}) {
  const baseUrl = clientOptions.baseUrl || ADMINUSERS_URL
  const correlationId = clientOptions.correlationId || ''
  const userResource = `${baseUrl}/v1/api/users`
  const forgottenPasswordResource = `${baseUrl}/v1/api/forgotten-passwords`
  const resetPasswordResource = `${baseUrl}/v1/api/reset-password`
  const serviceResource = `${baseUrl}/v1/api/services`
  const inviteResource = `${baseUrl}/v1/api/invites`

  /**
   * Get a User by external id
   *
   * @param {string} externalId
   * @return {Promise<User>} A promise of a User
   */
  const getUserByExternalId = (externalId) => {
    const params = {
      correlationId: correlationId
    }
    const url = `${userResource}/${externalId}`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'GET',
      description: 'find a user',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context, responseBodyToUserTransformer)

    requestLogger.logRequestStart(context)

    baseClient.get(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   * Get a User by external id
   *
   * @param {string} externalId
   * @return {Promise<User>} A promise of a User
   */
  const getUsersByExternalIds = (externalIds = []) => {
    const params = {
      correlationId: correlationId,
      qs: {
        ids: externalIds.join()
      }
    }
    const url = userResource
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'GET',
      description: 'find a user',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context, responseBodyToUserListTransformer)

    requestLogger.logRequestStart(context)

    baseClient.get(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   * @param username
   * @param password
   * @returns {Promise<User>}
   */
  const authenticateUser = (username, password) => {
    const params = {
      correlationId: correlationId,
      payload: {
        username: username,
        password: password
      }
    }

    const url = `${userResource}/authenticate`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'authenticate a user',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context, responseBodyToUserTransformer)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   *
   * @param externalId
   * @returns {Promise}
   */
  const incrementSessionVersionForUser = (externalId) => {
    const params = {
      correlationId: correlationId,
      payload: {
        op: 'append',
        path: 'sessionVersion',
        value: 1
      }
    }

    const url = `${userResource}/${externalId}`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'PATCH',
      description: 'increment session version for a user',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context, responseBodyToUserTransformer)

    requestLogger.logRequestStart(context)

    baseClient.patch(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   *
   * @param username
   * @returns {Promise<ForgottenPassword>}
   */
  const createForgottenPassword = (username) => {
    const params = {
      correlationId: correlationId,
      payload: {
        username: username
      }
    }
    const url = forgottenPasswordResource
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'create a forgotten password for a user',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   *
   * @param code
   * @returns {Promise<ForgottenPassword>}
   */
  const getForgottenPassword = (code) => {
    const params = {
      correlationId: correlationId
    }
    const url = `${forgottenPasswordResource}/${code}`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'GET',
      description: 'get a forgotten password',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)

    requestLogger.logRequestStart(context)

    baseClient.get(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   *
   * @param token
   * @param newPassword
   * @returns {Promise}
   */
  const updatePasswordForUser = (token, newPassword) => {
    const params = {
      correlationId: correlationId,
      payload: {
        forgotten_password_code: token,
        new_password: newPassword
      }
    }
    const url = resetPasswordResource
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'update a password for a user',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   *
   * @param externalId
   * @returns {Promise}
   */
  const sendSecondFactor = (externalId) => {
    const params = {
      correlationId: correlationId
    }

    const url = `${userResource}/${externalId}/second-factor/`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'post a second factor auth token to the user',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   *
   * @param externalId
   * @param code
   * @returns {Promise}
   */
  const authenticateSecondFactor = (externalId, code) => {
    const params = {
      correlationId: correlationId,
      payload: {
        code: code
      }
    }

    const url = `${userResource}/${externalId}/second-factor/authenticate`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'authenticate a second factor auth token entered by user',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context, responseBodyToUserTransformer)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  const getServiceUsers = (serviceExternalId) => {
    const url = `${serviceResource}/${serviceExternalId}/users`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'GET',
      description: 'get a services users',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context, responseBodyToUserListTransformer)
    requestLogger.logRequestStart(context)

    baseClient.get(url, {correlationId: correlationId}, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   *
   * @param userExternalId
   * @param serviceExternalId
   * @param roleName
   */
  const assignServiceRole = (userExternalId, serviceExternalId, roleName) => {
    const params = {
      correlationId: correlationId,
      payload: {
        service_external_id: serviceExternalId,
        role_name: roleName
      }
    }

    const url = `${userResource}/${userExternalId}/services`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'assigns user to a new service',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context, responseBodyToUserTransformer)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   *
   * @param externalId
   * @param serviceExternalId
   * @param roleName
   * @returns {Promise<User>}
   */
  const updateServiceRole = (externalId, serviceExternalId, roleName) => {
    const params = {
      correlationId: correlationId,
      payload: {
        role_name: roleName
      }
    }

    const url = `${userResource}/${externalId}/services/${serviceExternalId}`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'PUT',
      description: 'update role of a service that currently belongs to a user',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context, responseBodyToUserTransformer)

    requestLogger.logRequestStart(context)

    baseClient.put(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   *
   * @param invitee
   * @param senderId
   * @param serviceExternalId
   * @param roleName
   * @returns {Promise}
   */
  const inviteUser = (invitee, senderId, serviceExternalId, roleName) => {
    const params = {
      correlationId: correlationId,
      payload: {
        email: invitee,
        sender: senderId,
        service_external_id: serviceExternalId,
        role_name: roleName
      }
    }

    const url = `${inviteResource}/user`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'invite a user to signup',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)
    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   * Get a valid invite or error if it's expired
   * @param inviteCode
   */
  const getValidatedInvite = (inviteCode) => {
    const params = {
      correlationId: correlationId
    }
    const url = `${inviteResource}/${inviteCode}`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'GET',
      description: 'find a validated invitation',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)

    requestLogger.logRequestStart(context)

    baseClient.get(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   * Generate OTP code for an invite
   *
   * @param inviteCode
   * @param telephoneNumber
   * @param password
   * @returns {*|Constructor}
   */
  const generateInviteOtpCode = (inviteCode, telephoneNumber, password) => {
    const params = {
      correlationId: correlationId
    }

    if (telephoneNumber || password) {
      params.payload = {
        telephone_number: telephoneNumber,
        password: password
      }
    }

    const url = `${inviteResource}/${inviteCode}/otp/generate`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'generate otp code for invite',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   * Complete a service invite
   *
   * @param inviteCode
   * @param gatewayAccountIds
   * @returns {*|promise|Constructor}
   */
  const completeInvite = (inviteCode, gatewayAccountIds) => {
    const params = {
      correlationId: correlationId
    }
    if (gatewayAccountIds) {
      params.payload = {
        gateway_account_ids: gatewayAccountIds
      }
    }

    const url = `${inviteResource}/${inviteCode}/complete`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'complete invite',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  const verifyOtpAndCreateUser = (code, verificationCode) => {
    const params = {
      correlationId: correlationId,
      payload: {
        code: code,
        otp: verificationCode
      }
    }

    const url = `${inviteResource}/otp/validate`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'submit otp code',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context, responseBodyToUserTransformer)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  const verifyOtpForServiceInvite = (inviteCode, verificationCode) => {
    const params = {
      correlationId: correlationId,
      payload: {
        code: inviteCode,
        otp: verificationCode
      }
    }

    const url = `${inviteResource}/otp/validate/service`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'submit service invite otp code',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  const resendOtpCode = (code, phoneNumber) => {
    const params = {
      correlationId: correlationId,
      payload: {
        code: code,
        telephone_number: phoneNumber
      }
    }

    const url = `${inviteResource}/otp/resend`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'resend otp code',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   * Submit service registration details
   *
   * @param email
   * @param phoneNumber
   * @param password
   */
  const submitServiceRegistration = (email, phoneNumber, password) => {
    const params = {
      correlationId: correlationId,
      payload: {
        email: email,
        telephone_number: phoneNumber,
        password: password
      }
    }
    const url = `${inviteResource}/service`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'submit service registration details',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  const deleteUser = (serviceExternalId, removerExternalId, userExternalId) => {
    const params = {
      correlationId: correlationId,
      headers: {}
    }
    const url = `${serviceResource}/${serviceExternalId}/users/${userExternalId}`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'DELETE',
      description: 'delete a user from a service',
      userDelete: userExternalId,
      userRemover: removerExternalId,
      service: SERVICE_NAME
    }
    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)
    requestLogger.logRequestStart(context)

    params.headers[HEADER_USER_CONTEXT] = removerExternalId
    baseClient.delete(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   * Create a service
   *
   * @param serviceName
   * @param gatewayAccountIds
   * @returns {*|promise|Constructor}
   */
  const createService = (serviceName, gatewayAccountIds) => {
    const params = {
      correlationId: correlationId,
      payload: {}
    }
    if (serviceName) {
      params.payload.name = serviceName
    }
    if (gatewayAccountIds) {
      params.payload.gateway_account_ids = gatewayAccountIds
    }
    const url = serviceResource
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'create service',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   * Update service name
   *
   * @param serviceExternalId
   * @param serviceName
   * @returns {*|Constructor|promise}
   */
  const updateServiceName = (serviceExternalId, serviceName) => {
    const params = {
      correlationId: correlationId,
      payload: {
        op: 'replace',
        path: 'name',
        value: serviceName
      }
    }

    const url = `${serviceResource}/${serviceExternalId}`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'PATCH',
      description: 'update service name',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)

    requestLogger.logRequestStart(context)

    baseClient.patch(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   * Update merchant details
   *
   * @param serviceExternalId
   * @param merchantDetails
   * @returns {*|Constructor|promise}
   */
  const updateMerchantDetails = (serviceExternalId, merchantDetails) => {
    const params = {
      correlationId: correlationId,
      payload: merchantDetails
    }

    const url = `${serviceResource}/${serviceExternalId}/merchant-details`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'PUT',
      description: 'update merchant details',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context)

    requestLogger.logRequestStart(context)

    baseClient.put(url, params, callbackToPromiseConverter)
    .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   * Add gateway accounts to service
   *
   * @param serviceExternalId
   * @param gatewayAccountIds {String[]} a list of (unassigned) gateway account ids to add to the service
   * @returns {Promise<Service|Error>}
   */
  const addGatewayAccountsToService = (serviceExternalId, gatewayAccountIds) => {
    const params = {
      correlationId: correlationId,
      payload: {
        op: 'add',
        path: 'gateway_account_ids',
        value: gatewayAccountIds
      }
    }

    const url = `${serviceResource}/${serviceExternalId}`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'PATCH',
      description: 'update service name',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context, responseBodyToServiceTransformer)

    requestLogger.logRequestStart(context)

    baseClient.patch(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }


  /**
   *
   * @param externalId
   * @param code
   * @returns {Promise}
   */
  const provisionNewOtpKey = (externalId) => {
    const params = {
      correlationId: correlationId
    }

    const url = `${userResource}/${externalId}/second-factor/provision`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'create a new 2FA provisional OTP key',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context, responseBodyToUserTransformer)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  /**
   *
   * @param externalId
   * @param code
   * @param secondFactor {String} 'SMS' or 'APP'
   * @returns {Promise}
   */
  const configureNewOtpKey = (externalId, code, secondFactor) => {
    const params = {
      correlationId: correlationId,
      payload: {
        code: code,
        second_factor: secondFactor
      }
    }

    const url = `${userResource}/${externalId}/second-factor/configure`
    const defer = q.defer()
    const startTime = new Date()
    const context = {
      url: url,
      defer: defer,
      startTime: startTime,
      correlationId: correlationId,
      method: 'POST',
      description: 'configure a new OTP key and method',
      service: SERVICE_NAME
    }

    const callbackToPromiseConverter = createCallbackToPromiseConverter(context, responseBodyToUserTransformer)

    requestLogger.logRequestStart(context)

    baseClient.post(url, params, callbackToPromiseConverter)
      .on('error', callbackToPromiseConverter)

    return defer.promise
  }

  return {
    // User-related Methods
    getForgottenPassword,
    createForgottenPassword,
    incrementSessionVersionForUser,
    getUserByExternalId,
    getUsersByExternalIds,
    authenticateUser,
    updatePasswordForUser,
    sendSecondFactor,
    authenticateSecondFactor,
    verifyOtpAndCreateUser,
    resendOtpCode,
    deleteUser,
    provisionNewOtpKey,
    configureNewOtpKey,

    // UserServiceRole-related Methods
    updateServiceRole,
    assignServiceRole,
    getServiceUsers,

    // Invite-related Methods
    verifyOtpForServiceInvite,
    inviteUser,
    getValidatedInvite,
    generateInviteOtpCode,
    completeInvite,
    submitServiceRegistration,

    // Service-related Methods
    createService,
    updateServiceName,
    updateMerchantDetails,
    addGatewayAccountsToService
  }
}
