describe('template spec', () => {
 /* 
 it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
*/




  it.only ('Log URLs from Goldfish', () => {
    const apiKey = Cypress.env('SheetAPIKey');  //sets API_KEY to the hidden APIKey in cyrpess.env.json
    const spreadSheetID = Cypress.env('SpreadSheetID');  //sets API_KEY to the hidden APIKey & spreadSheetID to hidden SpreadSheetID in cypress.env.json
    const range = "SecretLair!A2:A29";  //sets the range param to a specific card
    var values = [];  //
    
    cy.task('google', {apiKey: apiKey, spreadSheetID: spreadSheetID, range: range }, {log: false}).then((res) => {  
      cy.visit('https://www.mtggoldfish.com/') // visit MTGgoldfish
      cy.wait(2000)
      
      for ( const TargetCard of res.data.values){  
        cy.log(`${TargetCard}`);  //prints card name in console
        
        cy.get('#query_string')  //get the search field 
          .clear()
          .type(String(TargetCard))  //types the card we're looking for
          cy.get('.input-group-append > .fa')  //find and click the search box
          .click()
        
        cy.url().then(($url) => {  //have to use this because you can't assign any cy.commands to vars
          values.push([$url]);  //adds the urls to the let values array delcared above
          cy.log(`${values}`);  //prints card name in console
          cy.log(`${TargetCard}`);  //prints card name in console

        })
        cy.wait(10000)
      }

    })

    const updaterange = "SecretLair!B2:B29";  //sets the range param to a specific card
    //GoogleUpdate will the spreadsheet using var values from above
    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: updaterange, values: values }, {log: false}).then((res) => {  

      cy.log('HHHEEELLLOOO WORLDDDDDDDDDDDDDDDDD')
  
      })

  })





  
})