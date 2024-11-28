import { useState, useEffect } from 'react';
import EncuestaForm from '../components/SurveyForm';
import api from '../services/api';

function EncuestasPage() {
  const [encuestas, setEncuestas] = useState([]);

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

  useEffect(() => {
    fetchEncuestas(); // Cargar encuestas al montar el componente
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
            {/* Agregar preguntas aquí si es necesario */}
            <ul className="mt-2 space-y-2">
              {encuesta.questions && encuesta.questions.map((question, index) => (
                <li key={index} className="text-gray-800">
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EncuestasPage;