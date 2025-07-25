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

        cy.wait(5000)
        

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

    const updaterange = "BuylistCheck!"  + "F" + StartCell + ":F" + EndCell;     ;  //sets the range param to a specific card
    //GoogleUpdate will the spreadsheet using var values from above
    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: updaterange, values: values.prices }, {log: false}).then((res) => {  
      cy.log('UPDATED PRICES')
      })

    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: "BuylistCheck!"  + "H" + StartCell + ":H" + EndCell, values: values.urls }, {log: false}).then((res) => {  
      cy.log('UPDATED URLS')
      })

  })

  it  ('401g Buylist Check', () => {
    const apiKey = Cypress.env('SheetAPIKey');  //sets API_KEY to the hidden APIKey in cyrpess.env.json
    const spreadSheetID = Cypress.env('SpreadSheetID');  //sets API_KEY to the hidden APIKey & spreadSheetID to hidden SpreadSheetID in cypress.env.json
    const range = "BuylistCheck!"  + "B" + StartCell + ":" + "C" + EndCell;    ;  //sets the range param to a specific card
    var values = {  //defines an object to contain values from search results to then paste to sheets
      prices:[],
      urls:[],
    };  //
    
    cy.task('google', {apiKey: apiKey, spreadSheetID: spreadSheetID, range: range }, {log: false}).then((res) => {  
      Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from failing the test
        return false
      })

      cy.viewport(1200, 1200)  //sets screensize of test
      cy.visit('https://buylist.401games.ca/retailer/buylist?product_line=Magic%3A+the+Gathering&sort=Relevance') // visits site
      cy.wait(1500)
      
      for ( const row of res.data.values){  
        const CardName = row[0]     //gets the cards name from cardname column
        const CardSet = row[1]  //sets the search term from column C (card set)
        cy.log(`${CardName}`);  //prints card name in console
        
        //find the search bar and type in it
        cy.get('.jsx-d5c17aca5107bb80') //find search bar and type
        .clear()     //empties the search field
        .type(String(CardName))  //types the card we're looking for
        cy.get('.jsx-1051462431 > .btn')  //finds & clicks the search button
        .click()
        cy.wait(3000)

        //search for the card set 
        cy.get('*[class="filter-dropdown-pill dropdown-toggle btn btn-light btn-sm"]').eq(1)  //clicks the set box button
        .click()
        cy.get('*[class="jsx-cacf4a593687f0c8 form-control set-search-bar-text"]')  //types in set search box
        .clear()  //empties the search field
        .type(String(CardSet))  //types the card set we're looking for
        cy.get('.dropdown-item') //clicks the set
        cy.get('.form-inline > .set-search-bar-button') //click the search btn
        .click()
        cy.wait(3000)

  
        cy.get('.jsx-9a89541ee4ca5ef6').eq(0).then(($span) => {  //have to use this because you can't assign any cy.commands to vars
          values.prices.push([$span.text()]);  //adds the urls to the let values array delcared above
          cy.log(`${values.prices}`);  //prints card price in console

        })

        cy.url().then(($url) => {  //have to use this because you can't assign any cy.commands to vars
          values.urls.push([$url]);  //adds the urls to the let values array delcared above
          cy.log(`${values.urls}`);  //prints card name in console
          cy.log(`${CardName}`);  //prints card name in console

        })
        cy.wait(3000)
      }

    })

    const updaterange = "BuylistCheck!E"  + StartCell + ":E" + EndCell;  //sets the range param to a specific card
    //GoogleUpdate will the spreadsheet using var values from above
    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: updaterange, values: values.prices }, {log: false}).then((res) => {  
      cy.log('UPDATED PRICES')
      })

    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: "BuylistCheck!G"  + StartCell + ":G" + EndCell, values: values.urls }, {log: false}).then((res) => {  
      cy.log('UPDATED URLS')
      })

  })






  
})