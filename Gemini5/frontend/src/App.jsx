import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Menu from "./pages/Menu";
import CreateSciPlan from "./pages/CreateSciPlan";
import DataProcessing from "./pages/DataProcessing"
import Submit from './pages/submit';  
import ValidatePlan from "./pages/ValidatePlan";
import SciencePlanList from "./pages/SciencePlanList";
import Navbar from "./components/Navbar";



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
            <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/home" element={ <Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="/menu" element={<Menu />} /> */}
              <Route path="/createSciPlan" element={<CreateSciPlan />} />
              <Route path="/Submit" element={<Submit />} />
              <Route path="/validate-plan" element={<ValidatePlan />} />
              <Route path="/validate-plan/:id" element={<ValidatePlan />} />
              <Route path="/show-list" element={<SciencePlanList />} />

              <Route path="/dataProcessing" element={<DataProcessing />} />
          </Routes>
      </Router>

  );
}

export default App;
