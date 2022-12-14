import axios from 'axios';
// import AxiosMockAdapter from 'axios-mock-adapter';
// all WEB traffic using this API instance
export const aws = axios.create({
   baseURL: 'https://xwt44qrls7.execute-api.us-east-2.amazonaws.com/Stage',
});