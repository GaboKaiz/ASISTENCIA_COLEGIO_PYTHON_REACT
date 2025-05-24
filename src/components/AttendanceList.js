import React, { useState, useEffect } from "react";
import axios from "axios";

const AttendanceList = () => {
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [dni, setDni] = useState("");
  const [teacher, setTeacher] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/attendance?nombre=${search}`
      );
      setAttendance(response.data);
    } catch (error) {
      alert("Error al obtener asistencia");
    }
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/verify", {
        dni,
      });
      setTeacher(response.data);
    } catch (error) {
      alert("Docente no encontrado");
    }
  };

  const handleMarkAttendance = async () => {
    if (!teacher) return;
    try {
      await axios.post("http://localhost:5000/api/attendance", {
        docente_id: teacher.id,
      });
      alert("Asistencia marcada");
      handleSearch();
    } catch (error) {
      alert("Error al marcar asistencia");
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="main-content">
      <div className="centered-container">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Asistencia de Docentes
        </h2>
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Verificar Docente
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center">
            <input
              type="text"
              placeholder="Ingrese DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="max-w-md"
            />
            <button
              onClick={handleVerify}
              className="bg-teal-500 text-white hover:bg-teal-600"
            >
              Verificar
            </button>
          </div>
          {teacher && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-gray-700">
                Docente: <span className="font-medium">{teacher.nombre}</span>
              </p>
              <button
                onClick={handleMarkAttendance}
                className="bg-blue-500 text-white hover:bg-blue-600 mt-2"
              >
                Marcar Asistencia
              </button>
            </div>
          )}
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Buscar Asistencia
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center">
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Buscar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table mx-auto">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>DNI</th>
                  <th>Tipo</th>
                  <th>Fecha y Hora</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record.id}>
                    <td>{record.nombre}</td>
                    <td>{record.dni}</td>
                    <td>{record.tipo}</td>
                    <td>{new Date(record.fecha_hora).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
