import { useState, useEffect } from 'react';
import EncuestaForm from '../components/SurveyForm';
import api from '../services/api';

function EncuestasPage() {
  const [encuestas, setEncuestas] = useState([]);
  const [detalleEncuesta, setDetalleEncuesta] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const fetchEncuestas = async () => {
    try {
      const { data } = await api.get('/survey');
      console.log(data);
      setEncuestas(data);
    } catch (err) {
      console.error('Error al cargar las encuestas:', err);
    }
  };

  const handleEncuestaCreada = () => {
    fetchEncuestas();
  };

  const verDetallesEncuesta = async (id) => {
    try {
      const { data } = await api.get(`/survey/${id}`);
      setDetalleEncuesta(data);
      setMostrarDetalles(true);
    } catch (err) {
      console.error('Error al cargar los detalles de la encuesta:', err);
    }
  };

  const cerrarDetalles = () => {
    setMostrarDetalles(false);
    setDetalleEncuesta(null);
  };

  const eliminarEncuesta = async (id) => {
    try {
      await api.delete(`/survey/delete/${id}`);
      setEncuestas(encuestas.filter(encuesta => encuesta._id !== id));
      cerrarDetalles(); // Cierra los detalles después de eliminar
    } catch (err) {
      console.error('Error al eliminar la encuesta:', err);
    }
  };

  useEffect(() => {
    fetchEncuestas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Mis Encuestas</h1>
      <div className="mb-6">
        <EncuestaForm onEncuestaCreada={handleEncuestaCreada} />
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {encuestas.map((encuesta) => (
          <li
            key={encuesta._id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{encuesta.title}</h3>
            <p className="text-gray-600">{encuesta.description}</p>
            <button
              onClick={() => verDetallesEncuesta(encuesta._id)}
              className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
            >
              Ver Detalles
            </button>
          </li>
        ))}
      </ul>

      {/* Modal o sección para mostrar detalles de la encuesta */}
      {mostrarDetalles && detalleEncuesta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">{detalleEncuesta.title}</h2>
            <p className="text-gray-600 mb-4">{detalleEncuesta.description}</p>
            <h3 className="font-semibold mb-2">Preguntas:</h3>
            <ul>
              {detalleEncuesta.questions.map((question, index) => (
                <li key={index} className="text-gray-800 mb-2">
                  <strong>{index + 1}. {question.pregunta}</strong>
                  {question.tipo === 'opcionM' && (
                    <ul className="pl-6 list-disc mt-2">
                      {question.opciones.map((opcion, idx) => (
                        <li key={idx} className="text-gray-600">{opcion}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => eliminarEncuesta(detalleEncuesta._id)}
              className="mt-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
            >
              Eliminar Encuesta
            </button>
            <button 
              onClick={cerrarDetalles} 
              className="mt-4 ml-2 bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EncuestasPage;