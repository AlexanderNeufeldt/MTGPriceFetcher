describe('template spec', () => {
 /* 
 it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
*/

const StartCell = 2;  //sheet starts at 2
const EndCell = 7;

  it ('FTF Buylist Check', () => {
    const apiKey = Cypress.env('SheetAPIKey');  //sets API_KEY to the hidden APIKey in cyrpess.env.json
    const spreadSheetID = Cypress.env('SpreadSheetID');  //sets API_KEY to the hidden APIKey & spreadSheetID to hidden SpreadSheetID in cypress.env.json
    const range = "BuylistCheck!"  + "B" + StartCell + ":" + "B" + EndCell;    ;  //sets the range param to a specific card
    var values = {  //defines an object to contain values from search results to then paste to sheets
      prices:[],
      urls:[],
    };  //
    
    cy.task('google', {apiKey: apiKey, spreadSheetID: spreadSheetID, range: range }, {log: false}).then((res) => {  
      Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from failing the test
        return false
      })
      
      cy.viewport(1080, 1080)  //sets screensize of test
      cy.visit('https://facetofacegames.com/pages/sell-your-cards') // visit ftf
      cy.wait(2500)
      cy.get('#Slide-template--24472504369524__logo_bar_CKX8R8-1 > .focus-inset > .bb-logo-img > .logo-bar__image') //find n click mtg
        .click()
      cy.wait(2500)

      for ( const TargetCard of res.data.values){  
        cy.log(`${TargetCard}`);  //prints card name in console
        
        cy.get('.bb-search-input > input') //get the search field 
          .clear()
          .type(String(TargetCard))  //types the card we're looking for
          cy.get('.bb-search-input > button')  //find and click the search box
          .click()

        cy.wait(9000)
        

          //if clicked card has the correct name add price & URL to list
          cy.get(':nth-child(2) > .bb-card-img > a > img').then(($span) => {  //have to use this because you can't assign any cy.commands to vars
            values.prices.push([$span.text()]);  //adds the urls to the let values array delcared above
            cy.log(`${values.prices}`);  //prints card price in console
          })

          cy.url().then(($url) => {  //have to use this because you can't assign any cy.commands to vars
            values.urls.push([$url]);  //adds the urls to the let values array delcared above
            cy.log(`${values.urls}`);  //prints card name in console
            cy.log(`${TargetCard}`);  //prints card name in console
          })

      }
    })

    const updaterange = "BuylistCheck!"  + "D" + StartCell + ":D" + EndCell;     ;  //sets the range param to a specific card
    //GoogleUpdate will the spreadsheet using var values from above
    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: updaterange, values: values.prices }, {log: false}).then((res) => {  
      cy.log('UPDATED PRICES')
      })

    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: "BuylistCheck!"  + "F" + StartCell + ":F" + EndCell, values: values.urls }, {log: false}).then((res) => {  
      cy.log('UPDATED URLS')
      })

  })

  it.only  ('Log URLs from FtF', () => {
    const apiKey = Cypress.env('SheetAPIKey');  //sets API_KEY to the hidden APIKey in cyrpess.env.json
    const spreadSheetID = Cypress.env('SpreadSheetID');  //sets API_KEY to the hidden APIKey & spreadSheetID to hidden SpreadSheetID in cypress.env.json
    const range = "MainSheet!B" + StartCell + ":B" + EndCell;  //sets the range param to a specific card
    var values = {  //defines an object to contain values from search results to then paste to sheets
      prices:[],
      urls:[],
    };  //
    
    cy.task('google', {apiKey: apiKey, spreadSheetID: spreadSheetID, range: range }, {log: false}).then((res) => {  
      cy.viewport(1080, 1080)  //sets screensize of test
      cy.visit('https://www.facetofacegames.com/') // visits site
      cy.wait(2000)
      
      for ( const TargetCard of res.data.values){  
        cy.log(`${TargetCard}`);  //prints card name in console
        
        //find the search bar and type in it
        cy.visit('https://www.facetofacegames.com/')
        cy.get('*[class^="hawk__searchBox__searchInput"]').eq(0)
        //.clear()  //empties search bar so next searches run smoothly
        .type(String(TargetCard))  //types the card we're looking for
        //finds & clicks the search button
        cy.get('*[class^="search-submit"]').eq(0)
        .click()
        
        cy.wait(3000)
        //click the first search result
        cy.get('*[class^="hawk-results__item-image"]').eq(0)
        .click()

        cy.wait(3000)
        cy.get('.primary-price--withoutTax > .price').then(($span) => {  //have to use this because you can't assign any cy.commands to vars
          values.prices.push([$span.text()]);  //adds the urls to the let values array delcared above
          cy.log(`${values.prices}`);  //prints card price in console

        })

        cy.url().then(($url) => {  //have to use this because you can't assign any cy.commands to vars
          values.urls.push([$url]);  //adds the urls to the let values array delcared above
          cy.log(`${values.urls}`);  //prints card name in console
          cy.log(`${TargetCard}`);  //prints card name in console

        })
        cy.wait(3000)
      }

    })

    const updaterange = "MainSheet!D"  + StartCell + ":D" + EndCell;  //sets the range param to a specific card
    //GoogleUpdate will the spreadsheet using var values from above
    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: updaterange, values: values.prices }, {log: false}).then((res) => {  
      cy.log('UPDATED PRICES')
      })

    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: "MainSheet!F"  + StartCell + ":F" + EndCell, values: values.urls }, {log: false}).then((res) => {  
      cy.log('UPDATED URLS')
      })

  })






  
})