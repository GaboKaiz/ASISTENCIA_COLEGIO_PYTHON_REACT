import React from "react";
import { Link } from "react-router-dom";
import logo from "../logo.png"; // Asegúrate de tener un logo en src/

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <div className="flex items-center mb-8">
        <img src={logo} alt="Logo Colegio" className="w-12 h-12 mr-2" />
        <h1 className="text-xl font-bold">Colegio Asistencia</h1>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <Link to="/" className="hover:text-gray-300">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/add-teacher" className="hover:text-gray-300">
              Agregar Docente
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/attendance" className="hover:text-gray-300">
              Asistencia
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
