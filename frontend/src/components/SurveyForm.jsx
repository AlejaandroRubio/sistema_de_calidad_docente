import { useState } from 'react';
import api from '../services/api';

function EncuestaForm({ onEncuestaCreada }) {
  // #region Initial State
  const initialFormData = {
    title: '',
    description: '',
    questions: [{ tipo: 'text', pregunta: '', opciones: [] }],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  //#endregion

  // #region Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuestionChange  = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].opciones[oIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };
  //#endregion

  // #region Question & Option Management
  const addQuestion = () => {
    const currentQuestion = formData.questions[formData.questions.length - 1];
    if (!currentQuestion.pregunta) {
      setError('La pregunta es obligatoria.');
      return;
    }
    if (currentQuestion.tipo === 'opcionM' && currentQuestion.opciones.length === 0) {
      setError('Las preguntas de opción múltiple requieren al menos una opción.');
      return;
    }

    setFormData({
      ...formData,
      questions: [...formData.questions, { tipo: 'text', pregunta: '', opciones: [] }],
    });
    setError('');
  };

  const addOption = (index) => {
    const updatedQuestions = [...formData.questions];
    const currentOptions = updatedQuestions[index].opciones;
    updatedQuestions[index].opciones = [...currentOptions, ''];
    setFormData({ ...formData, questions: updatedQuestions });
  };
  //#endregion

  //#region Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación final
    if (!formData.title) {
      setError('El título es obligatorio.');
      return;
    }
    if (formData.questions.length === 0) {
      setError('Debes agregar al menos una pregunta.');
      return;
    }

    // Envío al backend
    try {
      await api.post('/survey/create', { 
        ...formData,
        user: 'your_user_id' // Asegúrate de proporcionar el ID del usuario actual
      });
      onEncuestaCreada(); // Callback para actualizar la lista de encuestas

      // Restablecer el formulario
      setFormData(initialFormData);
      setError(''); // Limpiar errores en caso de que haya mensajes previos
    } catch (err) {
      setError('Error al crear la encuesta: ' + err.response.data.message || err.message);
    }
  };
  //#endregion

  //#region Render
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Crear Encuesta</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <input
        type="text"
        name="title"
        placeholder="Título"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
      />
      <textarea
        name="description"
        placeholder="Descripción"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
      />
      
      <h3 className="text-lg font-semibold mb-2">Preguntas</h3>
      {formData.questions.map((pregunta, index) => (
        <div key={index} className="mb-4">
          <input
            type="text"
            placeholder="Pregunta"
            value={pregunta.pregunta}
            onChange={(e) =>
              handleQuestionChange (index, 'pregunta', e.target.value)
            }
            className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
            required
          />
          <select
            value={pregunta.tipo}
            onChange={(e) =>
              handleQuestionChange (index, 'tipo', e.target.value)
            }
            className="mb-2 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
          >
            <option value="text">Texto</option>
            <option value="opcionM">Opciones Múltiples</option>
            <option value="siNo">Sí/No</option>
          </select>
          {pregunta.tipo === 'opcionM' && (
            <div className="mb-2">
              {pregunta.opciones.map((opcion, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  placeholder={`Opción ${oIndex + 1}`}
                  value={opcion}
                  onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                  className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
                />
              ))}
              <button
                type="button"
                onClick={() => addOption(index)}
                className="text-blue-500 hover:underline text-sm"
              >
                Añadir opción
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addQuestion}
        className="bg-gray-200 m-1 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition mb-4"
      >
        Añadir Pregunta
      </button>
      <button
        type="submit"
        className="bg-green-500 m-1 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition mb-4"
      >
        Guardar Encuesta
      </button>
    </form>
  );
}
//#endregion

export default EncuestaForm;