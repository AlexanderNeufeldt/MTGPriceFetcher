const { defineConfig } = require("cypress");

const { google } = require('googleapis');


module.exports = defineConfig({
  // setupNodeEvents can be defined in either the e2e or component configuration
  
  projectId: "a8zfd6",  //cypress cloud uses this to communicate with the project

  pageLoadTimeout: 30000,   //gives pages 30 seconds to load, needed occasionally for goldfish
  
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {    
        
        /*params contains the follwing object: 
        {
          spreadSheetID: the identifier for the spreadsheet to update
          range: the sheets formula range ie. A1:B69 to update
          values: array of arrays representing values for cells within the update range
        }

        */
        async GoogleUpdate(params) {    //declares a task function named GoogleUpdate that we use to update a sheet
          const auth = new google.auth.GoogleAuth({    //sets up a google authentication object for our account
            keyFile: "CREDENTIALS.json",    // gives the auth object our credentials json for service account authentication
            scopes: "https://www.googleapis.com/auth/spreadsheets",  // lets out update call have access to google sheets api
          });

          const sheets = google.sheets({    //make a variable that contains a sheets api client
              version: 'v4',  // every example ever has this set to this
          }); 
          google.options({auth})  // set our auth object as the global auth option, this applies to all google apis, just a settings thing
          const res = await sheets.spreadsheets.values.update({  // this is the function that actually does the updating, spec passes in relevant info
            spreadsheetId: params.spreadSheetID,  // a variable that gets passed the spreadsheet ID when called in spec
            range: params.range,  // a variable that gets the updated target range when called in spec
            valueInputOption: "USER_ENTERED", // defines how google will interpret the passed data, options are Raw, user_entered, "date"
            resource: {   // the body of the request to sheets, this is a object
              values: params.values,  //
            },
          });

          return res;  // returns the range results to const res
        },


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
    



    
    },
  },
})