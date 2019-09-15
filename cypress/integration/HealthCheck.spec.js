describe('Health Check', function() {

  it('can be created', function() {

    // visit site
    cy.visit('/')
    cy.get('h1').contains('Team Health Checker').should('be.visible')
    
    // create new health check
    cy.get('button').contains('Create New Health Check').click()
    cy.get('h2').contains('You created a new Health Check!').should('be.visible')
    cy.get('#shareLink').invoke('val').should('contain', 'localhost:3000/check/')
    
    // take health check
    cy.get('a').contains('View health check').click()
    cy.get('button').contains('Begin Health Check').click()
    cy.get('h2').contains('Easy to Release').should('be.visible')

    // require selection to advance
    cy.get('button').contains('Next').should('be.disabled')
    
    // fill out health check
    cy.fillOutHealthCheck()

    // view results
    cy.get('h2').contains('Thanks for completing the health check!!').should('be.visible')
    cy.get('a').contains('View results').click()
    cy.get('h1').contains('Health Check Results').should('be.visible')
    cy.get('p').contains('1 response so far').should('be.visible')
    cy.verifyRating('Easy to Release', 0, 0, 1)
    cy.verifyRating('Suitable Process', 0, 1, 0)
    cy.verifyRating('Health of Codebase', 1, 0, 0)
    cy.verifyRating('Delivering Value', 0, 0, 1)
    cy.verifyRating('Speed', 0, 1, 0)
    cy.verifyRating('Mission', 1, 0, 0)
    cy.verifyRating('Fun', 0, 0, 1)
    cy.verifyRating('Learning', 0, 1, 0)
    cy.verifyRating('Support', 1, 0, 0)
    cy.verifyRating('Pawns or Players', 0, 0, 1)
    cy.verifyRating('Teamwork', 0, 1, 0)

    // take again
    cy.go('back')
    cy.get('button').contains('Begin Health Check').click()
    cy.fillOutHealthCheck()

    // view results
    cy.get('h2').contains('Thanks for completing the health check!!').should('be.visible')
    cy.get('a').contains('View results').click()
    cy.get('h1').contains('Health Check Results').should('be.visible')
    cy.get('p').contains('2 responses so far').should('be.visible')
    cy.verifyRating('Easy to Release', 0, 0, 2)
    cy.verifyRating('Suitable Process', 0, 2, 0)
    cy.verifyRating('Health of Codebase', 2, 0, 0)
    cy.verifyRating('Delivering Value', 0, 0, 2)
    cy.verifyRating('Speed', 0, 2, 0)
    cy.verifyRating('Mission', 2, 0, 0)
    cy.verifyRating('Fun', 0, 0, 2)
    cy.verifyRating('Learning', 0, 2, 0)
    cy.verifyRating('Support', 2, 0, 0)
    cy.verifyRating('Pawns or Players', 0, 0, 2)
    cy.verifyRating('Teamwork', 0, 2, 0)
  })
})
