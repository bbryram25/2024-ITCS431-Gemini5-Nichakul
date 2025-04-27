import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateSciPlan from "./pages/CreateSciencePlan";
import SciencePlanList from "./pages/SciencePlanList";
import Detail from "./pages/PlanDetail";
import Submit from './pages/SubmitPlan';  
import ValidatePlan from "./pages/ValidatePlan";

function App() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Navbar />
            <Routes>
                {/* Public routes - no authentication needed */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes - need authentication */}
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/sciencePlans" element={<PrivateRoute><SciencePlanList /></PrivateRoute>} />
                <Route path="/createSciencePlan" element={<PrivateRoute><CreateSciPlan /></PrivateRoute>} />
                <Route path="/submitSciencePlan/:id" element={<PrivateRoute><Submit /></PrivateRoute>} />
                <Route path="/submitSciencePlan" element={<PrivateRoute><Submit /></PrivateRoute>} />
                <Route path="/validateSciencePlan" element={<PrivateRoute><ValidatePlan /></PrivateRoute>} />
                <Route path="/validateSciencePlan/:id" element={<PrivateRoute><ValidatePlan /></PrivateRoute>} />
                <Route path="/detail/:id" element={<PrivateRoute><Detail /></PrivateRoute>} />

                {/* Catch unmatched routes - redirect to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;