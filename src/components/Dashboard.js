import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [teacherCount, setTeacherCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/stats");
        setTeacherCount(response.data.teacher_count);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="main-content ml-64 p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">
          Bienvenido al Sistema de Asistencia
        </h3>
        <p className="text-gray-600 mb-6">
          Gestiona la asistencia de docentes de manera eficiente con nuestro
          sistema integrado.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h4 className="text-lg font-medium text-blue-800">
              Docentes Registrados
            </h4>
            <p className="text-2xl font-bold text-blue-600">{teacherCount}</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg shadow-sm">
            <h4 className="text-lg font-medium text-teal-800">
              Asistencias Hoy
            </h4>
            <p className="text-2xl font-bold text-teal-600">18</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
            <h4 className="text-lg font-medium text-orange-800">
              Última Actualización
            </h4>
            <p className="text-2xl font-bold text-orange-600">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
