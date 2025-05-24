import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import TeacherForm from "./components/TeacherForm";
import AttendanceList from "./components/AttendanceList";

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-teacher" element={<TeacherForm />} />
            <Route path="/attendance" element={<AttendanceList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
