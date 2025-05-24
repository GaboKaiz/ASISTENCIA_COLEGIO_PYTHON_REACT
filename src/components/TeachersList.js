import React, { useState, useEffect } from "react";
import axios from "axios";

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/teachers`);
        setTeachers(response.data);
        setFilteredTeachers(response.data);
      } catch (error) {
        console.error("Error al obtener docentes:", error);
        alert("Error al cargar la lista de docentes");
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    const filtered = teachers.filter((teacher) =>
      teacher.nombre.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTeachers(filtered);
  }, [search, teachers]);

  const handleTeacherClick = async (teacher) => {
    setSelectedTeacher(teacher);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/attendance?nombre=${teacher.nombre}`
      );
      setAttendance(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error al obtener asistencia:", error);
      alert("Error al cargar la asistencia");
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300x200?text=Sin+Foto";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
    setAttendance([]);
  };

  return (
    <div className="main-content">
      <div className="centered-container">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Lista de Docentes
        </h2>
        <div className="card mb-6">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Buscar Docente
          </h3>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="card cursor-pointer hover:shadow-lg transition-shadow w-full max-w-sm"
              onClick={() => handleTeacherClick(teacher)}
            >
              <img
                src={
                  teacher.foto
                    ? `${BASE_URL}${teacher.foto}`
                    : "https://via.placeholder.com/300x200?text=Sin+Foto"
                }
                alt={teacher.nombre}
                className="w-full h-48 object-cover rounded-t-lg"
                onError={handleImageError}
              />
              <div className="p-4 text-center">
                <h4 className="text-lg font-semibold text-gray-800">
                  {teacher.nombre}
                </h4>
                <p className="text-gray-600">DNI: {teacher.dni}</p>
                <p className="text-gray-600">Correo: {teacher.correo}</p>
                <p className="text-gray-600">Celular: {teacher.celular}</p>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && selectedTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-center flex-1">
                    Asistencia de {selectedTeacher.nombre}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                {attendance.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table mx-auto">
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Fecha y Hora</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map((record) => (
                          <tr key={record.id}>
                            <td>{record.tipo}</td>
                            <td>
                              {new Date(record.fecha_hora).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center">
                    No hay registros de asistencia.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersList;
