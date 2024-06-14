describe('template spec', () => {
 /* 
 it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
*/


  it('PRINTS STUDENT MAJORS', () => {
    const apiKey = Cypress.env('SheetAPIKey');  //sets API_KEY to the hidden APIKey in cyrpess.env.json
    const spreadSheetID = Cypress.env('SpreadSheetID');  //sets API_KEY to the hidden APIKey & spreadSheetID to hidden SpreadSheetID in cypress.env.json

    cy.task('google', {apiKey: apiKey, spreadSheetID: spreadSheetID}, {log: false}).then((res) => {  /*executes the google task function in 
    cypress.config.js. 
    cy.task('google').then((res) => {  /*executes the google task function in cypress.config.js. 
    because the google task is "async" we use ".then(res)" so the test works */

      const rows = res.data.values;  // res is return res , data.value is the fetched range (L23) 
      if (rows.length === 0) {    //if the fetched range has no data return this error
          cy.log('No data found.');  // prints to console
      } else {   
          cy.log('Name, Major:');  // prints to console
          for (const row of rows) {  //otherwise iterates over the returned rows
              // Print columns A and E, which correspond to indices 0 and 4.
              cy.log(`${row[0]}, ${row[4]}`);   //prints the first and fifth column
          }
      }
    })

  })

/*
  it('TESTNAME', () => {

  })
*/

})