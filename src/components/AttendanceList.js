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
      handleSearch(); // Actualizar lista
    } catch (error) {
      alert("Error al marcar asistencia");
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Asistencia de Docentes</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Verificar Docente</h3>
        <input
          type="text"
          placeholder="Ingrese DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleVerify}
          className="bg-green-500 text-white p-2 rounded"
        >
          Verificar
        </button>
        {teacher && (
          <div className="mt-2">
            <p>Docente: {teacher.nombre}</p>
            <button
              onClick={handleMarkAttendance}
              className="bg-blue-500 text-white p-2 rounded mt-2"
            >
              Marcar Asistencia
            </button>
          </div>
        )}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Buscar Asistencia</h3>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Buscar
        </button>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">DNI</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record.id}>
              <td className="border p-2">{record.nombre}</td>
              <td className="border p-2">{record.dni}</td>
              <td className="border p-2">{record.tipo}</td>
              <td className="border p-2">
                {new Date(record.fecha_hora).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;
