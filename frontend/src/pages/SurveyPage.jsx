import { useState, useEffect } from 'react';
import EncuestaForm from '../components/SurveyForm';
import api from '../services/api';

function EncuestasPage() {
  const [encuestas, setEncuestas] = useState([]);
  const [detalleEncuesta, setDetalleEncuesta] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState({ name: '', email: '', password: '' });
  const [editingUser, setEditingUser] = useState(false);

  const fetchEncuestas = async (title = '') => {
    try {
      const { data } = title 
        ? await api.get(`/survey/search/by-title?title=${title}`)
        : await api.get('/survey');
      setEncuestas(data);
    } catch (err) {
      console.error('Error al cargar las encuestas:', err);
    }
  };

  const verDetallesEncuesta = async (id) => {
    try {
      const { data } = await api.get(`/survey/${id}`);
      const username = await api.get(`auth/user/${data.user}`);
      const detalleConUsuario = {
        ...data,
        username: username.data ? username.data.name : 'Usuario eliminado',
      };
      setDetalleEncuesta(detalleConUsuario);
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
      cerrarDetalles();
    } catch (err) {
      console.error('Error al eliminar la encuesta:', err);
    }
  };

  const updateUser = async () => {
    try {
      await api.put('/auth/update', userData); // Aquí actualiza el usuario
      setEditingUser(false); // Cerrar el modo de edición
      setUserData({ name: '', email: '', password: '' });
      // También podrías actualizar el estado del usuario aquí si lo necesitas
    } catch (err) {
      console.error('Error al actualizar los datos del usuario:', err);
    }
  };

  useEffect(() => {
    fetchEncuestas();
  }, []);

  useEffect(() => {
    if (searchTerm !== '') {
      fetchEncuestas(searchTerm);
    } else {
      fetchEncuestas();
    }
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Encuestas</h1>
        <button
          onClick={() => setEditingUser(true)}
          className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
        >
          Editar Datos de Usuario
        </button>
      </div>
  
      <div className="mb-6">
        <EncuestaForm onEncuestaCreada={() => fetchEncuestas()} />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por título"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
  
      {/* Modal para editar los datos de usuario */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">Editar Datos de Usuario</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              className="border p-2 rounded w-full mb-4"
            />
            <button
              onClick={updateUser}
              className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
            >
              Actualizar
            </button>
            <button
              onClick={() => setEditingUser(false)}
              className="ml-2 bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
  
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {encuestas.map((encuesta) => (
          <li key={encuesta._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
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
  
      {/* Modal para mostrar detalles de la encuesta */}
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
            <hr className="my-4" />
            <h3 className="font-semibold mt-4">Creada por: {detalleEncuesta.username}</h3>
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