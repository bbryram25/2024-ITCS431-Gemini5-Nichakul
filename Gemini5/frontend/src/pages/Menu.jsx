// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// function Menu() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     document.title = "Menu | GEMINI5";
//   }, []);

//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   return (
//     <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900">
//       <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md">
//         <h2 className="text-center text-xl font-semibold mb-6">
//           Menu
//         </h2>
//         <div className="space-y-4">
//           <button
//             onClick={() => handleNavigation("/show-list")}
//             className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
//           >
//             Show Science Plan List
//           </button>
//           <button
//             onClick={() => handleNavigation("/CreateSciPlan")}
//             className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
//           >
//             Create Science Plan
//           </button>
//           <button
//             onClick={() => handleNavigation("/validate-plan")}
//             className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
//           >
//             Validate Science Plan
//           </button>
//           <button
//             onClick={() => handleNavigation("/submit")}
//             className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
//           >
//             Submit Science Plan
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Menu;
