import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
// import CreatePlan from "./pages/CreatePlan";
import Submit from './pages/submit';  
import ValidatePlan from "./pages/ValidatePlan";
import SciencePlanList from "./pages/SciencePlanList";



function App() {
  return (
      <Router
          future={{
              v7_startTransition: true,  // Enable the v7_startTransition flag
              v7_relativeSplatPath: true,  // Enable the v7_relativeSplatPath flag
          }}
      >
          <Routes>
              <Route path="/" element={ <Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/menu" element={<Menu />} />
              {/* <Route path="/CreatePlan" element={<CreatePlan />} /> */}
              <Route path="/Submit" element={<Submit />} />
              <Route path="/validate-plan" element={<ValidatePlan />} />
              <Route path="/show-list" element={<SciencePlanList />} />

          </Routes>
      </Router>

  );
}

export default App;
