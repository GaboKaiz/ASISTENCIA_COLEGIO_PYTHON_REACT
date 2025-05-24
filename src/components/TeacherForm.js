import React, { useState } from "react";
import axios from "axios";

const TeacherForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    correo: "",
    celular: "",
    foto: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, foto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("dni", formData.dni);
    data.append("correo", formData.correo);
    data.append("celular", formData.celular);
    if (formData.foto) {
      data.append("foto", formData.foto);
    }

    try {
      await axios.post("http://localhost:5000/api/teachers", data);
      alert("Docente agregado correctamente");
      setFormData({ nombre: "", dni: "", correo: "", celular: "", foto: null });
    } catch (error) {
      alert("Error al agregar docente");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Agregar Docente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">DNI</label>
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Correo</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Celular</label>
          <input
            type="text"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Foto</label>
          <input
            type="file"
            name="foto"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
            accept="image/*"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Agregar Docente
        </button>
      </form>
    </div>
  );
};

export default TeacherForm;
