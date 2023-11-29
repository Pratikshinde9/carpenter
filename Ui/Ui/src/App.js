// import './App.css';
// import './'
// import Chat from './Chat';
// import Login from './Component/Login';
// import React, { useState } from "react";

// function App() {
  
//   //window.localStorage.removeItem("jwtToken")
//   const jwttoken=window.localStorage.getItem('jwtToken');
  
//       if (jwttoken)
//         return (
//           <Chat/>
//         );
//       else 
//           return(
//             <Login/>
//         );
// }

// export default App;

import "./App.css";
import "./";
import Chat from "./Chat";
import Login from "./Component/Login";
import React, { useState } from "react";
import { MsalProvider } from "@azure/msal-react";

 
function App({msalInstance}){
  return (
      <MsalProvider instance={msalInstance}>
           < Login />
      </MsalProvider>
     
     
  )
}
/*
 
function App() {
  //window.localStorage.removeItem("jwtToken")
  const jwttoken=window.localStorage.getItem('jwtToken');
 
      if (jwttoken)
        return (
 
          <Chat/>
        );
      else
          return(
            <Login/>
        );
 
}
*/
export default App;
