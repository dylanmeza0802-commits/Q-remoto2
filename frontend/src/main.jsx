import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import JoinQueue     from "./pages/JoinQueue.jsx";
import StudentView   from "./pages/StudentView.jsx";
import AdminPanel    from "./pages/AdminPanel.jsx";
import CanastaConfig from "./pages/CanastaConfig.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/"               element={<Navigate to="/join" />} />
        <Route path="/join"           element={<JoinQueue />} />
        <Route path="/queue/:queueId" element={<StudentView />} />
        <Route path="/admin"          element={<AdminPanel />} />
        <Route path="/canasta"        element={<CanastaConfig />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);