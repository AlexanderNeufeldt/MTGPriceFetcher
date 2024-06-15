const { defineConfig } = require("cypress");

const { google } = require('googleapis');


module.exports = defineConfig({
  // setupNodeEvents can be defined in either the e2e or component configuration
  
  projectId: "a8zfd6",  //cypress cloud uses this to communicate with the project
  
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {    
        async google(params) {    //declares a task function named google
          const sheets = google.sheets({    //make a variable that contains a sheets api client using API_KEY auth
              version: 'v4',
              auth: params.apiKey
          });

          const res = await sheets.spreadsheets.values.get(   //gets the result of a values.get call and assigns those results to res
              {
                  spreadsheetId: params.spreadSheetID,  //put in spreadsheet ID aka what you're targeting
                  range: 'Class Data!A2:E',
              }
          );
          return res;  // returns the range results to const res
        },
      })
    },
  },
})