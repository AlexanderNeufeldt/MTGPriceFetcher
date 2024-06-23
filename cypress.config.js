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
          //info on .get  https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get
              {
                  spreadsheetId: params.spreadSheetID,  //put in spreadsheet ID aka what you're targeting
                  range: params.range,  //lets the range be customized when the function is called
              }
          );
          return res;  // returns the range results to const res
        },
      })
    
      on('task', {    
        async googleupdate(params) {    //declares a task function named googleupdate
          const sheets = google.sheets({    //make a variable that contains a sheets api client using API_KEY auth
              version: 'v4',
              auth: params.apiKey
          });

          const res = await sheets.spreadsheets.values.update(   //API call that lets you write a single range
          //info on .update  https://developers.google.com/sheets/api/guides/values
              {
                  spreadsheetId: params.spreadSheetID,  //put in spreadsheet ID aka what you're targeting
                  range: params.range,  //lets the range be customized when the function is called
              }
          );
          return res;  // returns the range results to const res
        },
      })
    



    
    },
  },
})