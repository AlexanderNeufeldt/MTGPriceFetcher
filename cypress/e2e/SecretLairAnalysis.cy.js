describe('template spec', () => {
 /* 
 it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
*/

const StartCell = 2;  //sheet starts at 2
const EndCell = 14;


  it.only  ('Log URLs from Goldfish', () => {


    const apiKey = Cypress.env('SheetAPIKey');  //sets API_KEY to the hidden APIKey in cyrpess.env.json
    const spreadSheetID = Cypress.env('SpreadSheetID');  //sets API_KEY to the hidden APIKey & spreadSheetID to hidden SpreadSheetID in cypress.env.json
    const range = "SecretLair!A" + StartCell + ":A" + EndCell;  //sets the range param to a specific card
    var values = [];  //
    
    cy.task('google', {apiKey: apiKey, spreadSheetID: spreadSheetID, range: range }, {log: false}).then((res) => {  
      Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from failing the test
        return false
      })

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

    const updaterange = "SecretLair!B" + StartCell + ":B" + EndCell;  //sets the range param to a specific card
    //GoogleUpdate will the spreadsheet using var values from above
    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: updaterange, values: values }, {log: false}).then((res) => {  

      cy.log('HHHEEELLLOOO WORLDDDDDDDDDDDDDDDDD')
  
      })

  })

  it ('Log EDHREC', () => {
    const apiKey = Cypress.env('SheetAPIKey');  //sets API_KEY to the hidden APIKey in cyrpess.env.json
    const spreadSheetID = Cypress.env('SpreadSheetID');  //sets API_KEY to the hidden APIKey & spreadSheetID to hidden SpreadSheetID in cypress.env.json
    const range = "SecretLair!A" + StartCell + ":A" + EndCell;;  //sets the range param to a specific card
    var values = {  //defines an object to contain values from search results to then paste to sheets
      EDHREC:[],
      urls:[],
    };  //

    //var values = [];  //
    
    cy.task('google', {apiKey: apiKey, spreadSheetID: spreadSheetID, range: range }, {log: false}).then((res) => {  

      Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from failing the test
        return false
      })

      cy.visit('https://edhrec.com/') // edhrec
      cy.wait(5000)
      
      for ( const TargetCard of res.data.values){  
        cy.log(`${TargetCard}`);  //prints card name in console
        
        cy.get('.Navbar_search___AXHe > .rbt > div > .rbt-input-main')  //get the search field 
          .clear()
          .type(String(TargetCard))  //types the card we're looking for
          cy.get('.AsyncTypeahead_right__Qv7Kn')  //find and click the search box
          .click()
        
        cy.wait(15000)

        cy.url().then(($url) => {  //have to use this because you can't assign any cy.commands to vars
          values.urls.push([$url]);  //adds the urls to the let values array delcared above
          cy.log(`${values.urls}`);  //prints card name in console
          cy.log(`${TargetCard}`);  //prints card name in console

        })

        cy.get('.CardPanel_container__xP8qy > .Card_container__Ng56K > .CardLabel_label__iAM7T').then(($span) => {  //have to use this because you can't assign any cy.commands to vars
          values.EDHREC.push([$span.text()]);  //adds the EDHREC stat to the let values array delcared above
          cy.log(`${values.EDHREC}`);  //prints card EDHREC stat in console

        })


        cy.wait(1000)
      }

    })

    const updaterange = "SecretLair!D" + StartCell + ":D" + EndCell;  //sets the range param to a specific card
    //GoogleUpdate will the spreadsheet using var values from above
    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: updaterange, values: values.urls }, {log: false}).then((res) => {  

      cy.log('UPDATED URLS')
  
      })
    
    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: "SecretLair!C"  + StartCell + ":C" + EndCell, values: values.EDHREC }, {log: false}).then((res) => {  

      cy.log('UPDATED EDHREC STATS')
  
      })

  })








  
})