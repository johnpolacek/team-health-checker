Cypress.Commands.add('verifyRating', (topicTitle, count0, count1, count2) => {
  cy.get('div').contains(topicTitle).parent().find('span').eq(0).invoke('text').should('eq',count0.toString())
  cy.get('div').contains(topicTitle).parent().find('span').eq(1).invoke('text').should('eq',count1.toString())
  cy.get('div').contains(topicTitle).parent().find('span').eq(2).invoke('text').should('eq',count2.toString())
})

Cypress.Commands.add('fillOutHealthCheck', test => {
  cy.get('h2').contains('Easy to Release').should('be.visible')
  cy.get('label').contains('Awesome').click()
  cy.get('button').contains('Next').click()

  cy.get('h2').contains('Suitable Process').should('be.visible')
  cy.get('label').contains('OK').click()
  cy.get('button').contains('Next').click()

  cy.get('h2').contains('Health of Codebase').should('be.visible')
  cy.get('label').contains('Sucky').click()
  cy.get('button').contains('Next').click()

  cy.get('h2').contains('Delivering Value').should('be.visible')
  cy.get('label').contains('Awesome').click()
  cy.get('button').contains('Next').click()

  cy.get('h2').contains('Speed').should('be.visible')
  cy.get('label').contains('OK').click()
  cy.get('button').contains('Next').click()

  cy.get('h2').contains('Mission').should('be.visible')
  cy.get('label').contains('Sucky').click()
  cy.get('button').contains('Next').click()

  cy.get('h2').contains('Fun').should('be.visible')
  cy.get('label').contains('Awesome').click()
  cy.get('button').contains('Next').click()

  cy.get('h2').contains('Learning').should('be.visible')
  cy.get('label').contains('OK').click()
  cy.get('button').contains('Next').click()

  cy.get('h2').contains('Support').should('be.visible')
  cy.get('label').contains('Sucky').click()
  cy.get('button').contains('Next').click()

  cy.get('h2').contains('Pawns or Players').should('be.visible')
  cy.get('label').contains('Awesome').click()
  cy.get('button').contains('Next').click()

  cy.get('h2').contains('Teamwork').should('be.visible')
  cy.get('label').contains('OK').click()
  cy.get('button').contains('Next').click()

  // confirm responses
  cy.get('h2').contains('Review your responses').should('be.visible')
  cy.get('div').contains('Easy to Release').parent().find('div').contains('Awesome').should('be.visible')
  cy.get('div').contains('Suitable Process').parent().find('div').contains('OK').should('be.visible')
  cy.get('div').contains('Health of Codebase').parent().find('div').contains('Sucky').should('be.visible')
  cy.get('div').contains('Delivering Value').parent().find('div').contains('Awesome').should('be.visible')
  cy.get('div').contains('Speed').parent().find('div').contains('OK').should('be.visible')
  cy.get('div').contains('Mission').parent().find('div').contains('Sucky').should('be.visible')
  cy.get('div').contains('Fun').parent().find('div').contains('Awesome').should('be.visible')
  cy.get('div').contains('Learning').parent().find('div').contains('OK').should('be.visible')
  cy.get('div').contains('Support').parent().find('div').contains('Sucky').should('be.visible')
  cy.get('div').contains('Pawns or Players').parent().find('div').contains('Awesome').should('be.visible')
  cy.get('div').contains('Teamwork').parent().find('div').contains('OK').should('be.visible')
  cy.get('button').contains('Confirm').click()

  cy.wait(2000)
})