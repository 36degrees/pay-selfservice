'use strict'

/**
 @class Service
 * @property {string} externalId - The external ID of the service
 * @property {string} name -  The name of the service
 * @property {string[]} gatewayAccountIds -  list of gateway account id's that belong to this service
 * @property {object} merchantDetails -  details of the registered merchant for this service
 */
class Service {
  /**
   * Create an instance of Service
   * @param {Object} serviceData - raw 'service' object from server
   * @param {string} serviceData.external_id - The external ID of the service
   * @param {string} serviceData.name - The name of the service
   * @param {object} serviceData.merchant_details -  details of the registered merchant for this service
   **/
  constructor (serviceData) {
    this.externalId = serviceData.external_id
    this.name = serviceData.name
    this.serviceName = serviceData.service_name
    this.gatewayAccountIds = serviceData.gateway_account_ids
    this.merchantDetails = serviceData.merchant_details
  }

  /**
   * @method toJson
   * @returns {Object} An 'adminusers' compatible representation of the service
   */
  toJson () {
    return {
      external_id: this.externalId,
      name: this.name,
      serviceName: this.serviceName,
      gateway_account_ids: this.gatewayAccountIds,
      merchant_details: this.merchantDetails
    }
  }
}

module.exports = Service
