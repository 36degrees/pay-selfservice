describe('Apple Pay', () => {
  const userExternalId = 'cd0fa54cf3b7408a80ae2f1b93e7c16e'
  const gatewayAccountId = 42
  const serviceName = 'My Awesome Service'

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('session', 'gateway_account')
  })

  describe('is disabled when unsupported', () => {
    beforeEach(() => {
      cy.task('setupStubs', [
        {
          name: 'getUserSuccess',
          opts: {
            external_id: userExternalId,
            service_roles: [{
              service: {
                gateway_account_ids: [gatewayAccountId],
                name: serviceName
              }
            }]
          }
        },
        {
          name: 'getGatewayAccountSuccess',
          opts: {
            gateway_account_id: gatewayAccountId,
            payment_provider: 'worldpay',
            allow_apple_pay: false
          }
        }
      ])
    })

    it('should show it is disabled', () => {
      cy.setEncryptedCookies(userExternalId, gatewayAccountId)
      cy.visit('/settings')
      cy.get('.govuk-summary-list__value').first().should('contain', 'Off')
      cy.get('a').contains('Change Apple Pay settings').click()
      cy.get('input[type="radio"]').should('have.length', 2)
      cy.get('input[value="on"]').should('not.be.checked')
      cy.get('input[value="off"]').should('be.checked')
      cy.get('#navigation-menu-settings').click()
      cy.get('.govuk-summary-list__value').first().should('contain', 'Off')
    })
  })

  describe('but allow us to enable when supported', () => {
    beforeEach(() => {
      cy.task('setupStubs', [
        {
          name: 'getUserSuccess',
          opts: {
            external_id: userExternalId,
            service_roles: [{
              service: {
                gateway_account_ids: [gatewayAccountId],
                name: serviceName
              }
            }]
          }
        },
        {
          name: 'getGatewayAccountSuccess',
          opts: {
            gateway_account_id: gatewayAccountId,
            payment_provider: 'worldpay',
            allow_apple_pay: false
          }
        }
      ])
    })

    it('Show that is is disabled', () => {
      cy.setEncryptedCookies(userExternalId, gatewayAccountId)
      cy.visit('/settings')
      cy.get('.govuk-summary-list__value').first().should('contain', 'Off')
      cy.get('a').contains('Change Apple Pay settings').click()
    })
  })

  describe('Show enabled after turning on', () => {
    beforeEach(() => {
      cy.task('setupStubs', [
        {
          name: 'getUserSuccess',
          opts: {
            external_id: userExternalId,
            service_roles: [{
              service: {
                gateway_account_ids: [gatewayAccountId],
                name: serviceName
              }
            }]
          }
        },
        {
          name: 'getGatewayAccountSuccess',
          opts: {
            gateway_account_id: gatewayAccountId,
            payment_provider: 'worldpay',
            allow_apple_pay: true
          }
        }
      ])
    })

    it('should allow us to enable', () => {
      cy.get('input[value="on"]').click()
      cy.get('input[value="on"]').should('be.checked')
      cy.get('.govuk-button').contains('Save changes').click()
      cy.get('.notification').should('contain', 'Apple Pay successfully enabled.')
      cy.get('input[value="on"]').should('be.checked')
      cy.get('#navigation-menu-settings').click()
      cy.get('.govuk-summary-list__value').first().should('contain', 'On')
    })
  })
})
