// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { EventType, PublicClientApplication } from "@azure/msal-browser";
//import FileUpload from './Chat/FileUpload';
const msconfig = new PublicClientApplication({
  auth: {
    clientId: "7c8b3613-ac22-47e5-9592-0e1cde9662ea",
    authority: "https://login.microsoftonline.com/8fd4ff6c-056d-4f5d-9094-eaed89bc6daf",
    redirectUrl: "http://localhost:3000",
  },
});
 
msconfig.addEventCallback((event) => {
  if (event.eventType == EventType.LOGIN_SUCCESS) {
    console.log(event);
    msconfig.setActiveAccount(event.payload.account);
  }
});
 
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App msalInstance={msconfig} />
  </React.StrictMode>
);
 
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();