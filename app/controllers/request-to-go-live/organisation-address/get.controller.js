'use strict'

const lodash = require('lodash')

const goLiveStage = require('../../../models/go-live-stage')
const paths = require('../../../paths')
const response = require('../../../utils/response')
const { countries } = require('@govuk-pay/pay-js-commons').utils
const formatServicePathsFor = require('../../../utils/format-service-paths-for')

const collectAdditionalKycData = process.env.COLLECT_ADDITIONAL_KYC_DATA === 'true'

module.exports = (req, res) => {
  // redirect on wrong stage
  if (req.service.currentGoLiveStage !== goLiveStage.ENTERED_ORGANISATION_NAME) {
    return res.redirect(
      303,
      formatServicePathsFor(paths.service.requestToGoLive.index, req.service.externalId)
    )
  }
  // initialise pageData
  let pageData = lodash.get(req, 'session.pageData.requestToGoLive.organisationAddress')
  if (pageData) {
    delete req.session.pageData.requestToGoLive.organisationAddress
  } else {
    const merchantDetails = lodash.get(req, 'service.merchantDetails')
    pageData = {
      ...lodash.pick(merchantDetails, [
        'address_line1',
        'address_line2',
        'address_city',
        'address_postcode',
        'address_country',
        'telephone_number',
        'url'
      ]),
      collectAdditionalKycData
    }
  }
  pageData.countries = countries.govukFrontendFormatted(lodash.get(pageData, 'address_country'))
  // render
  return response.response(req, res, 'request-to-go-live/organisation-address', pageData)
}
