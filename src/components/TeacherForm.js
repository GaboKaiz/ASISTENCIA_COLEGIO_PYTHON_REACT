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
      stopCamera(); // Detener la cámara al desmontar el componente
    };
  }, []);

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
          {!cameraActive ? (
            <>
              <input
                type="file"
                name="foto"
                onChange={handleFileChange}
                className="w-full border p-2 rounded"
                accept="image/*"
              />
              <button
                type="button"
                onClick={startCamera}
                className="bg-green-500 text-white p-2 rounded mt-2"
              >
                Tomar Foto con Cámara
              </button>
            </>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                className="w-full max-w-md border rounded"
              ></video>
              <canvas
                ref={canvasRef}
                width="640"
                height="480"
                className="hidden"
              ></canvas>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Capturar Foto
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Detener Cámara
                </button>
              </div>
            </>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Agregar Docente
        </button>
      </form>
    </div>
  );
};

export default TeacherForm;
