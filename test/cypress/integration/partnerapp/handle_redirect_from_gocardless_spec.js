const { getUserStub, getDirectDebitGatewayAccountStub } = require('../../utils/common_stubs')

describe('Get request to complete Go Cardless linking', () => {
  const userExternalId = 'cd0fa54cf3b7408a80ae2f1b93e7c16e'
  const gatewayAccountId = 'DIRECT_DEBIT:42'

  beforeEach(() => {
    cy.setEncryptedCookies(userExternalId, gatewayAccountId)
  })

  describe('Success', () => {
    beforeEach(() => {
      cy.task('setupStubs', [
        getUserStub(userExternalId, [gatewayAccountId]),
        getDirectDebitGatewayAccountStub(gatewayAccountId, 'test', 'gocardless')
      ])
    })

    it('should show success message', () => {
      cy.visit('/oauth/complete?state=blah&code=blahblah')
      cy.get('.govuk-panel--confirmation > h2').should('contain', 'Successfully connected to GoCardless')
    })
  })

  describe('Account already connected', () => {
    beforeEach(() => {
      cy.task('setupStubs', [
        getUserStub(userExternalId, [gatewayAccountId]),
        getDirectDebitGatewayAccountStub(gatewayAccountId, 'test', 'gocardless'),
        { name: 'exchangeGoCardlessAccessCodeAccountAlreadyConnected' }
      ])
    })

    it('should display an error page', () => {
      cy.visit('/oauth/complete?state=blah&code=blahblah', { failOnStatusCode: false })
      cy.get('h1').should('contain', 'An error occurred:')
      cy.get('#errorMsg').should('contain', 'This Go Cardless account is already connected. Please try again with a different account.')
    })
  })
})
