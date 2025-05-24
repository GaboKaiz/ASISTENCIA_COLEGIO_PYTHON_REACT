import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import TeacherForm from "./components/TeacherForm";
import AttendanceList from "./components/AttendanceList";
import TeachersList from "./components/TeachersList";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-teacher" element={<TeacherForm />} />
          <Route path="/attendance" element={<AttendanceList />} />
          <Route path="/teachers" element={<TeachersList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
