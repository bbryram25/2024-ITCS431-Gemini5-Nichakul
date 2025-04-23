import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

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
          </Routes>
      </Router>

  );
}

export default App;
