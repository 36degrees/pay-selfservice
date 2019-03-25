'use strict'

// Local dependencies
const { isEmpty, isNotVatNumber } = require('../../../../browsered/field-validation-checks')

exports.validateMandatoryField = function validateMandatoryField (value) {
  const isEmptyErrorMessage = isEmpty(value)
  if (isEmptyErrorMessage) {
    return {
      valid: false,
      message: isEmptyErrorMessage
    }
  }

  const isNotVatNumberErrorMessage = isNotVatNumber(value)
  if (isNotVatNumberErrorMessage) {
    return {
      valid: false,
      message: isNotVatNumberErrorMessage
    }
  }

  return {
    valid: true,
    message: null
  }
}
