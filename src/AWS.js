import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
// all WEB traffic using this API instance
export const aws = axios.create({
   baseURL: 'https://xwt44qrls7.execute-api.us-east-2.amazonaws.com/Prod/',
   headers: {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST'
   }
});
 
// create Mock for this
const mockAws = new AxiosMockAdapter(aws, { delayResponse: 0 });
mockAws.onPost('/registerDesigner')
     .reply(200, { 
      body: {
        designer: {
            email: 'email',
            name: 'name',
            projects: [] 
        }
      }
     });