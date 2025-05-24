import React from "react";
import { Link } from "react-router-dom";
import logo from "../logo.png";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white h-screen p-6 fixed">
      <div className="flex items-center mb-10">
        <img
          src={logo}
          alt="Logo Colegio"
          className="w-10 h-10 mr-3 rounded-full"
        />
        <h1 className="text-xl font-bold tracking-tight">Colegio Asistencia</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="block py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/add-teacher"
              className="block py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Agregar Docente
            </Link>
          </li>
          <li>
            <Link
              to="/attendance"
              className="block py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Asistencia
            </Link>
          </li>
          <li>
            <Link
              to="/teachers"
              className="block py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Lista de Docentes
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
