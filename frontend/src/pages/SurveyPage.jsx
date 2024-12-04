import { useState, useEffect } from 'react';
import EncuestaForm from '../components/SurveyForm';
import api from '../services/api';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate


function SurveyPage() {
//#region State Management
const [survey, setSurvey] = useState([]);// `survey` almacena las encuestas obtenidas desde la API.
const [surveyDetails, setSurveyDetails] = useState(null);// `surveyDetails` contiene los detalles de una encuesta seleccionada.
const [showDetails, setShowDetails] = useState(false);// `showDetails` controla si se muestra el modal con detalles de la encuesta.
const [searchTerm, setSearchTerm] = useState('');// `searchTerm` almacena el término de búsqueda para filtrar encuestas.
const [userData, setUserData] = useState({ name: '', email: '', password: '' });// `userData` contiene la información del usuario para actualizarla o editarla.
const [editingUser, setEditingUser] = useState(false);// `editingUser` indica si el modal para editar datos del usuario está activo.
const [username, setUsername] = useState('');// `username` almacena el nombre del usuario desde el localStorage.
const navigate = useNavigate();// Hook de navegación para redireccionar.

//#endregion

// #region API Calls
  // Función para obtener todas las encuestas o filtrar por título.
  const fetchSurveys  = async (title = '') => {
    try {
      const { data } = title 
        ? await api.get(`/survey/search/by-title?title=${title}`) // Buscar por título.
        : await api.get('/survey');  // Obtener todas las encuestas.
      setSurvey(data);
    } catch (err) {
      console.error('Error al cargar las survey:', err);
    }
  };

  // Obtener detalles de una encuesta específica por su ID.
  const viewSurveyDetails = async (id) => {
    try {
      const { data } = await api.get(`/survey/${id}`); // Datos de la encuesta.
      const username = await api.get(`auth/user/${data.user}`); // Información del creador.
      const detalleConUsuario = {
        ...data,
        username: username.data ? username.data.name : 'Usuario eliminado', // Manejo de usuario eliminado.
      };
      setSurveyDetails(detalleConUsuario);
      setShowDetails(true); // Mostrar detalles en el modal.
    } catch (err) {
      console.error('Error al cargar los detalles de la encuesta:', err);
    }
  };

  // Cerrar el modal de detalles. 
  const closeDetails  = () => {
    setShowDetails(false);
    setSurveyDetails(null);
  };

  // Eliminar una encuesta por su ID.
  const deleteSurvey  = async (id) => {
    try {
      await api.delete(`/survey/delete/${id}`);  // Llamada a la API para eliminar.
      setSurvey(survey.filter(encuesta => encuesta._id !== id));// Actualizar lista de encuestas.
      closeDetails ();
    } catch (err) {
      console.error('Error al eliminar la encuesta:', err);
    }
  };

  // Actualizar los datos del usuario actual.
  const updateUser = async () => {
    try {
      await api.put('/auth/update', userData); // Enviar los datos editados.
      setEditingUser(false); // Cerrar el modal de edición.
      setUserData({ name: '', email: '', password: '' }); // Limpiar los datos temporales.
    } catch (err) {
      console.error('Error al actualizar los datos del usuario:', err);
    }
  };
  // Eliminar la cuenta del usuario.
  const deleteUser = async () => {
    try {
      await api.delete('/auth/delete'); // Llamada a la API para borrar la cuenta.
      localStorage.removeItem('token'); // Eliminar token local.
      navigate('/'); // Redirigir a la página principal.
    } catch (err) {
      console.error('Error al eliminar la cuenta:', err);
    }
  };
//#endregion

// #region Handlers
  // Cerrar sesión del usuario.
  const logout = () => {
    localStorage.removeItem('token'); // Eliminar el token del storage
    navigate('/'); // Redirigir a la página principal
  };
// #endregion

 // #region Effects
  // Verificar si el token del usuario es válido.
  useEffect(() => {
 
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');  // Redirigir si no hay token.
      } else {
        try {
          const response= await api.get('/auth/verify-Token');
          if (response.data === true) {
            console.log('Token verificado');
          }else{
            // Manejo de token no válido
            console.log('Token no verificado');
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            navigate('/');
          }

        } catch (err) {
          console.error('Error al verificar el token:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          navigate('/');
          return;
        }
      }
    }
    verifyToken();
  }, [navigate]);


  useEffect(() => {
    fetchSurveys ();
    setUsername(localStorage.getItem('userName'));
    

  }, []);

  useEffect(() => {
    if (searchTerm !== '') {
      fetchSurveys (searchTerm);
    } else {
      fetchSurveys ();
    }
  }, [searchTerm]);
//#endregion
  
//#region Render
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hola, {username}</h1>
        <button
          onClick={() => setEditingUser(true)}
          className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
        >
          Editar Datos de Usuario
        </button>
      </div>
  
      <div className="mb-6">
        <EncuestaForm onEncuestaCreada={() => fetchSurveys ()} />
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-10/12 md:w-1/3 lg:w-1/4">
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
            <div className="flex justify-between items-center">
              <div className="flex">
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

              <button
                onClick={deleteUser}
                className="ml-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
              >
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      )}
  
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {survey.map((encuesta) => (
          <li key={encuesta._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">{encuesta.title}</h3>
            <p className="text-gray-600">{encuesta.description}</p>
            <button
              onClick={() => viewSurveyDetails(encuesta._id)}
              className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
            >
              Ver Detalles
            </button>
          </li>
        ))}
      </ul>
  
      {/* Modal para mostrar detalles de la encuesta */}
      {showDetails && surveyDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">{surveyDetails.title}</h2>
            <p className="text-gray-600 mb-4">{surveyDetails.description}</p>
            <h3 className="font-semibold mb-2">Preguntas:</h3>
            <ul>
              {surveyDetails.questions.map((question, index) => (
                <li key={index} className="text-gray-800 mb-2">
                  <strong>{index + 1}. {question.pregunta}</strong>
                  {question.tipo === 'opcionM' && (
                    <ul className="pl-6 list-disc mt-2">
                      {question.opciones.map((opcion, idx) => (
                        <li key={idx} className="text-gray-600">{opcion}</li>
                      ))}
                    </ul>
                  )}
                  {question.tipo === 'siNo' && (
                    <p className="text-gray-600">Sí/No</p>
                  )}
                  {question.tipo === 'text' && (
                    <p className="text-gray-600">Texto</p>
                  )}
                </li>
              ))}
            </ul>
            <hr className="my-4" />
            <h3 className="font-semibold mt-4">Creada por: {surveyDetails.username}</h3>
            <button 
              onClick={() => deleteSurvey (surveyDetails._id)}
              className="mt-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
            >
              Eliminar Encuesta
            </button>
            <button 
              onClick={closeDetails} 
              className="mt-4 ml-2 bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      
      {/* Botón para cerrar sesión */}
      <div className="fixed bottom-4 right-4">
        <button 
          onClick={logout} 
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
  //#endregion
}

export default SurveyPage; 