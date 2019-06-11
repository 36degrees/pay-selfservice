describe('Dashboard', () => {
  const userExternalId = 'cd0fa54cf3b7408a80ae2f1b93e7c16e'
  const gatewayAccountId = 'DIRECT_DEBIT:42'
  const serviceName = 'Test Service'

  function setupDirectDebitGatewayAccount (isConnected, paymentProvider = 'gocardless') {
    cy.task('setupStubs', [
      {
        name: 'getUserSuccess',
        opts: {
          external_id: userExternalId,
          service_roles: [{
            service: {
              name: serviceName,
              gateway_account_ids: [gatewayAccountId]
            }
          }]
        }
      },
      {
        name: 'getDirectDebitGatewayAccountSuccess',
        opts: {
          gateway_account_id: gatewayAccountId,
          payment_provider: paymentProvider,
          is_connected: isConnected
        }
      }
    ])
  }

  beforeEach(() => {
    cy.setEncryptedCookies(userExternalId, gatewayAccountId)
  })

  describe('Dashboard', () => {
    const dashboardUrl = `/`

    it(`should display Connect to GoCardless if direct debit gateway account is not connected to GoCardless`, () => {
      setupDirectDebitGatewayAccount(false)

      cy.visit(dashboardUrl)
      cy.get('h1').should('contain', 'Connect to GoCardless')
      cy.get('a[href="/link-account"').should('exist')
    })

    it('should display Dashboard if direct debit gateway account is connected to GoCardless', function () {
      setupDirectDebitGatewayAccount(true)

      cy.visit(dashboardUrl)
      cy.get('h1').should('contain', 'Dashboard')
      cy.get('a[href="https://manage.gocardless.com/sign-in"').should('exist')
    })

    it('should display Dashboard for direct debit sandbox gateway account', function () {
      setupDirectDebitGatewayAccount(false, 'sandbox')

      cy.visit(dashboardUrl)
      cy.get('h1').should('contain', 'Dashboard')
    })
  })
})
