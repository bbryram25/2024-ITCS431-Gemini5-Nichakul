import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateSciPlan from "./pages/CreateSciPlan";
import Submit from './pages/Submit';  
import ValidatePlan from "./pages/ValidatePlan";
import SciencePlanList from "./pages/SciencePlanList";
import Navbar from "./components/Navbar";
import Detail from "./pages/detail";




function App() {
  return (
      <Router
          future={{
              v7_startTransition: true,  // Enable the v7_startTransition flag
              v7_relativeSplatPath: true,  // Enable the v7_relativeSplatPath flag
          }}
      >
        <Navbar />
          <Routes>
            {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
              <Route path="/" element={ <Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/sciencePlans" element={<SciencePlanList />} />
              <Route path="/createSciencePlan" element={<CreateSciPlan />} />
              <Route path="/submitSciencePlan/:id" element={<Submit />} />
              <Route path="/submitSciencePlan" element={<Submit />} />
              <Route path="/validateSciencePlan" element={<ValidatePlan />} />
              <Route path="/validateSciencePlan/:id" element={<ValidatePlan />} />
              <Route path="/detail/:id" element={<Detail />} />
          </Routes>
      </Router>

  );
}

export default App;
