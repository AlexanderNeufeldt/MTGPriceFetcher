describe('template spec', () => {
 /* 
 it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
*/

const StartCell = 2;  //sheet starts at 2
const EndCell = 29;

  it ('PRINTS CARD QUANTITY & NAME', () => {
    
    const apiKey = Cypress.env('SheetAPIKey');  //sets API_KEY to the hidden APIKey in cyrpess.env.json
    const spreadSheetID = Cypress.env('SpreadSheetID');  //sets API_KEY to the hidden APIKey & spreadSheetID to hidden SpreadSheetID in cypress.env.json
    const range = "MainSheet!" + "A" + StartCell + ":" + "B" + EndCell;  //sets the range param to mostly the whole sheet

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

  it   ('Log URLs from 401g', () => {
    const apiKey = Cypress.env('SheetAPIKey');  //sets API_KEY to the hidden APIKey in cyrpess.env.json
    const spreadSheetID = Cypress.env('SpreadSheetID');  //sets API_KEY to the hidden APIKey & spreadSheetID to hidden SpreadSheetID in cypress.env.json
    const range = "MainSheet!"  + "B" + StartCell + ":" + "D" + EndCell;    ;  //sets the range param to multiple columns
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
      cy.visit('https://store.401games.ca/') // visit 401games
      cy.wait(5000)
      
      for ( const row of res.data.values){  
        const CardName = row[0]     //gets the cards name from cardname column
        const TargetCard = row[2]  //sets the search term from column D (name + set n info)
        cy.log(`${TargetCard}`);  //prints card name in console
        
        cy.get('#isp_main_input') //get the search field 
          .clear().type(String(TargetCard))  //clears and types the card we're looking for
        cy.get('#isp_main_search_button')  //find and click the search box
          .click()

        cy.wait(10000)
        
        //finding and clicking the first search result
        cy.get("#fast-simon-serp-app").shadow().find("a.product-image").first().click()
        cy.wait(3000)

        cy.get('.product-title > .mb-0').invoke("text").then((JohnParkCardName) => {    //sets **CardName var to card name on page
        if (JohnParkCardName.includes(CardName)) {
          //if clicked card has the correct name add price & URL to list
          cy.get('#ProductPrice-product-template').then(($span) => {  //have to use this because you can't assign any cy.commands to vars
            values.prices.push([$span.text()]);  //adds the urls to the let values array delcared above
            cy.log(`${values.prices}`);  //prints card price in console
          })

          cy.url().then(($url) => {  //have to use this because you can't assign any cy.commands to vars
            values.urls.push([$url]);  //adds the urls to the let values array delcared above
            cy.log(`${values.urls}`);  //prints card name in console
            cy.log(`${TargetCard}`);  //prints card name in console
          })
        } else {
          //IF the found card does not contain the card name return NULL to google sheets
          cy.get('#ProductPrice-product-template').then(($span) => {  
            $span = "NULL";  //add NULL to price list to indicate the search was a whiff
            values.prices.push([$span]);  
          })
          
          cy.url().then(($url) => {  
            $url = "NULL";  //add NULL to URL list to indicate the search was a whiff
            values.urls.push([$url]);  
          })
        }

        cy.log(JohnParkCardName);
        cy.log(TargetCard);
        cy.log(JohnParkCardName.includes(CardName), { matchCase: false });

      })
    }
  })
    
    const updaterange = "MainSheet!"  + "E" + StartCell + ":E" + EndCell;     ;  //sets the range param to a specific card
    //GoogleUpdate will the spreadsheet using var values from above
    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: updaterange, values: values.prices }, {log: false}).then((res) => {  
      cy.log('UPDATED PRICES')
      })

    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: "MainSheet!"  + "G" + StartCell + ":G" + EndCell, values: values.urls }, {log: false}).then((res) => {  
      cy.log('UPDATED URLS')
      })

  })

  it.only  ('Log URLs from FtF', () => {
    const apiKey = Cypress.env('SheetAPIKey');  //sets API_KEY to the hidden APIKey in cyrpess.env.json
    const spreadSheetID = Cypress.env('SpreadSheetID');  //sets API_KEY to the hidden APIKey & spreadSheetID to hidden SpreadSheetID in cypress.env.json
    const range = "MainSheet!B" + StartCell + ":D" + EndCell;  //sets the range param to a specific card
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
      cy.visit('https://www.facetofacegames.com/') // visits site
      cy.wait(2000)
      cy.log(res.data.values)
      for ( const row of res.data.values){
        const CardName = row[0]
        const TargetCard = row[2]

        cy.log(`${TargetCard}`);  //prints card name in console
        
        //find the search bar and type in it
        cy.visit('https://www.facetofacegames.com/')
        cy.get('.bb-search-input > input')
        .type(String(TargetCard))  //types the card we're looking for
        //finds & clicks the search button
        cy.get('.bb-search-input > button')
        .click()
        
        cy.wait(3000)
        //click the first search result
        cy.get(':nth-child(2) > .bb-card-img > a > img')
        .click()

        cy.wait(3000)

        //put the IF card name check here
        cy.get('h1').invoke("text").then((FTFCardName) => {
        if (FTFCardName.includes(CardName)) {
          //if (FTFCardName.includes(TargetCard)) {
            cy.get(':nth-child(1) > .f2f-fv--price > .price > .price__container > .price__regular > .price-item').then(($span) => {  //have to use this because you can't assign any cy.commands to vars
            values.prices.push([$span.text().trim()]);  //adds the price to the let values array delcared above. trims empty spaces
            cy.log(`${values.prices}`);  //prints card price in console

          })

          cy.url().then(($url) => {  //have to use this because you can't assign any cy.commands to vars
            values.urls.push([$url]);  //adds the urls to the let values array delcared above
            cy.log(`${values.urls}`);  //prints card name in console
            cy.log(`${TargetCard}`);  //prints card name in console

          })
        } else {
          //IF the found card does not contain the card name return NULL to google sheets
          cy.get(':nth-child(1) > .f2f-fv--price > .price > .price__container > .price__regular > .price-item').then(($span) => { 
            $span = "NULL";  //add NULL to price list to indicate the search was a whiff
            values.prices.push([$span]);  
          })
          
          cy.url().then(($url) => {  
            $url = "NULL";  //add NULL to URL list to indicate the search was a whiff
            values.urls.push([$url]);  
          })

        }
        cy.log(FTFCardName);
        cy.log(TargetCard);
        cy.log(TargetCard.includes(FTFCardName), { matchCase: false });

      });

        
        cy.wait(3000)
      }

    })

    const updaterange = "MainSheet!F"  + StartCell + ":F" + EndCell;  //sets the range param to a specific card
    //GoogleUpdate will the spreadsheet using var values from above
    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: updaterange, values: values.prices }, {log: false}).then((res) => {  
      cy.log('UPDATED PRICES')
      })

    cy.task('GoogleUpdate', { spreadSheetID: spreadSheetID, range: "MainSheet!H"  + StartCell + ":H" + EndCell, values: values.urls }, {log: false}).then((res) => {  
      cy.log('UPDATED URLS')
      })

  })






  
})