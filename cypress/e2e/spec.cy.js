describe('template spec', () => {
 /* 
 it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
*/


  it ('PRINTS CARD QUANTITY & NAME', () => {
    const apiKey = Cypress.env('SheetAPIKey');  //sets API_KEY to the hidden APIKey in cyrpess.env.json
    const spreadSheetID = Cypress.env('SpreadSheetID');  //sets API_KEY to the hidden APIKey & spreadSheetID to hidden SpreadSheetID in cypress.env.json
    const range = "MainSheet!A2:C22";  //sets the range param to mostly the whole sheet

    cy.task('google', {apiKey: apiKey, spreadSheetID: spreadSheetID, range: range}, {log: false}).then((res) => {  /*executes the google task function in 
    cypress.config.js. 
    cy.task('google').then((res) => {  /*executes the google task function in cypress.config.js. 
    because the google task is "async" we use ".then(res)" so the test works */

      const rows = res.data.values;  // res is return res (see cypress config) , data.value is the fetched range (L23) 
      if (rows.length === 0) {    //if the fetched range has no data return this error
          cy.log('No data found.');  // prints to console
      } else {   
          cy.log('Quantity, Card Name:');  // prints to console
          for (const row of rows) {  //otherwise iterates over the returned rows
              // Print columns A and B, which correspond to indices 0 and 1.
              cy.log(`${row[0]}, ${row[1]}`);   //prints the first and second row
          }
      }
    })

  })

  it.only ('FIND & SEARCH THE 13TH ENTRY', () => {
    const apiKey = Cypress.env('SheetAPIKey');  //sets API_KEY to the hidden APIKey in cyrpess.env.json
    const spreadSheetID = Cypress.env('SpreadSheetID');  //sets API_KEY to the hidden APIKey & spreadSheetID to hidden SpreadSheetID in cypress.env.json
    const range = "MainSheet!B13";  //sets the range param to a specific card

    cy.task('google', {apiKey: apiKey, spreadSheetID: spreadSheetID, range: range }, {log: false}).then((res) => {  

        const TargetCard = 	res.data.values;  //sets TargetCard to the function output, aka B13

        cy.visit('https://store.401games.ca/') // visit 401games
        cy.wait(2000)
        cy.log(`${TargetCard}`);  //prints card name in console

        cy.get('#isp_main_input') //get the search field 
          .type(String(TargetCard))  //types the card we're looking for
        cy.get('#isp_main_search_button')  //find and click the search box
          .click()
        
        cy.url().then(($url) => {  //have to use this because you can't assign any cy.commands to vars
          const URL401games = $url;  //asigns current URL to const var
          cy.log(`${URL401games}`);  //prints card name in console
          cy.log(`${TargetCard}`);  //prints card name in console

        })


    })

  })





  
})