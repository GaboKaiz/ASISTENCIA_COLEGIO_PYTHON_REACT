import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const TeacherForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    correo: "",
    celular: "",
    foto: null,
  });
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, foto: e.target.files[0] });
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      alert("No se pudo acceder a la cámara. Asegúrate de permitir el acceso.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      canvasRef.current.toBlob((blob) => {
        const file = new File([blob], `${formData.dni}_photo.jpg`, {
          type: "image/jpeg",
        });
        setFormData({ ...formData, foto: file });
        stopCamera();
      }, "image/jpeg");
    }
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

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="main-content ml-64 p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Agregar Docente</h2>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              DNI
            </label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Celular
            </label>
            <input
              type="text"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Foto
            </label>
            {!cameraActive ? (
              <div className="mt-1 space-y-4">
                <input
                  type="file"
                  name="foto"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={startCamera}
                  className="bg-teal-500 text-white hover:bg-teal-600"
                >
                  Tomar Foto con Cámara
                </button>
              </div>
            ) : (
              <div className="mt-1">
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full max-w-md rounded-lg border border-gray-200"
                ></video>
                <canvas
                  ref={canvasRef}
                  width="640"
                  height="480"
                  className="hidden"
                ></canvas>
                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Capturar Foto
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Detener Cámara
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white hover:bg-blue-600 w-full"
          >
            Agregar Docente
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;
