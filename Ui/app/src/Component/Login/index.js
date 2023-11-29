

// import { useEffect, useState } from 'react';
// import Chat from '../../Chat';
// import axios from "axios";

// const Login = () => {
//     const [JWT, setJWT] = useState();
//     const [Loginid, setLoginid] = useState("");
//     const [Pass, setPass] = useState("");
//     //localStorage.setItem('jwtToken', 'your JWT token here');
//     /*useEffect(() => {
//         console.log("use effect")
//     if (JWT!=="")
//         <Chat/>
//     }, [JWT])*/

//     const logincode = () => {
//         console.log("inside login code")
//         let apires = ""
//         const validate = async () => {
//             alert("test")
//             console.log("validate")
//             const response = await axios
//                 .get("http://127.0.0.1:5002/validateLogin", {
//                     params: {
//                         Loginid: Loginid,
//                         Pass: Pass,
//                     },
//                 })
//                 .then((response) => {
//                     apires = response;
//                 });
//             window.localStorage.setItem('jwtToken', apires.data.token);
//             window.localStorage.setItem('userid', Loginid);
//         };
//         return (
//             <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
//                 {/* <div className='company-logo-wrapper'>
//                 <a href="https://www.carpentertechnology.com" class="company-link">
//                     <img src="https://www.carpentertechnology.com/hubfs/logos/carpenter-technology-logo.svg" />
//                 </a>
//               </div> */}
//                 <div className="login-main-wrapper w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl p-5">

//                     <div className='company-big-logo-wrapper mb-5'>
//                         <img className='logo' src="https://www.carpentertechnology.com/hubfs/logos/carpenter-technology-logo.svg" />
//                     </div>

//                     <div className='mb-5'>
//                         <h5 className='text-center'>
//                             <strong>GenAI Conversational Interface</strong>
//                         </h5>
//                     </div>

//                     {/* <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
//                    Sign in
//                 </h1> */}
//                     {/* <h1 className="text-3xl font-semibold text-center">
//                    Sign in
//                 </h1> */}
//                     <form className="mt-6">
//                         {/* <div className="mb-2">
//                         <label
//                             for="email"
//                             className="block text-sm font-semibold text-gray-800"
//                         >
//                             UserId
//                         </label>
//                         <input
//                             type="email"
//                             value={Loginid}
//                             onChange={(e) => setLoginid(e.target.value)}
//                             className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
//                         />
//                     </div> */}
//                         {/* <div className="mb-2">
//                         <label
//                             for="password"
//                             className="block text-sm font-semibold text-gray-800"
//                         >
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             value={Pass}
//                             onChange={(e) => setPass(e.target.value)}
//                             className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
//                         />
//                     </div> */}
//                         {/* <div className="mt-6 d-grid">
//                         <button
//                          onClick={() =>{validate();} }
//                          className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
//                             Login
//                         </button>
//                         <button
//                          onClick={() =>{validate();} }
//                          className="btn btn-primary ">
//                             Login
//                         </button>
//                     </div> */}
//                         {/* <div class="hr-sect mt-3">OR</div> */}
//                         <div className="mt-6 d-grid position-relative">
//                             {/* <button
//                          onClick={() =>{validate();} }
//                          className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
//                             Login
//                         </button> */}
//                             <button className="btn ms-btn btn-outline-primary">
//                                 <div>
//                                 <span>
//                                     <svg className='ms-icon position-absolute' viewBox="0 0 32 32" width="24"
//                                     height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="17" y="17" width="10" height="10" fill="#FEBA08"></rect> <rect x="5" y="17" width="10" height="10" fill="#05A6F0"></rect> <rect x="17" y="5" width="10" height="10" fill="#80BC06"></rect> <rect x="5" y="5" width="10" height="10" fill="#F25325"></rect> </g></svg>
//                                 </span>
//                                 <span>
//                                     Login With Microsoft
//                                 </span>
//                                 </div>
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         );
//     }


//     console.log("inside login .js")

//     /*useEffect(() => {
//         logincode();
//     }, [])*/
//     return (
//         <div>
//             {console.log(Loginid)}
//             {console.log(Pass)}
//             {logincode()}
//         </div>
//     );
// };
// export default Login;

import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useIsAuthenticated } from "@azure/msal-react";
import Chat from "../../Chat/index";
import carpenterLogo from "../../carpenter-technology-logo.svg"
 
const Login = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
 
  const handleSignIn = () => {
    instance.loginRedirect({ scopes: ["user.read"] });
  };
 
  useEffect(() => {
    // Check if user is authenticated
    if (isAuthenticated) {
      // Redirect to Chat component or perform any other actions
      console.log("User is authenticated");
    } else {
      console.log("User authentication failed");
    }
  }, [isAuthenticated]);
 
  return (
    <div >
      {!isAuthenticated && (<div className="loginContainer">
        <div className="login-box login-main-wrapper w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl p-5">
          <div className="company-big-logo-wrapper mb-5">
            <img className='logo' src={carpenterLogo} id="carpenterLogo"/>
          </div>
          <div className='mb-5'>
              <h5 className='text-center'>
                <strong>
                  GenAI Conversational Interface
                </strong>                        
              </h5>
          </div>
              <div className="mt-6 d-grid position-relative">
                  <button
              onClick={handleSignIn}
              className="btn ms-btn btn-outline-primary"
            >
               <span>
                              <svg className='ms-icon position-absolute' viewBox="0 0 32 32" width="24"
                                    height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="17" y="17" width="10" height="10" fill="#FEBA08"></rect> <rect x="5" y="17" width="10" height="10" fill="#05A6F0"></rect> <rect x="17" y="5" width="10" height="10" fill="#80BC06"></rect> <rect x="5" y="5" width="10" height="10" fill="#F25325"></rect> </g></svg>
                                </span>
                                <span>
                                    Login With Microsoft
                                </span>
            </button>
            </div>
        </div>
      </div>)}
     
      {isAuthenticated && <Chat />}
    </div>
  );
};
 
export default Login;