import { useState } from "react";
import api from "../services/api";

function AuthForm({ onAuthSuccess }) { // Componente para manejar el formulario de autenticación.
    const [isRegistering, setIsRegistering] = useState(false); // Estado para alternar entre registro e inicio de sesión.
    const [formData, setFormData] = useState({ // Estado para almacenar los datos del formulario.
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState(null); // Estado para manejar mensajes de error.

    // Maneja los cambios en los inputs del formulario.
    const handleChange = (e) => {
        const { name, value } = e.target; // Obtiene el nombre y valor del input.
        setFormData({ ...formData, [name]: value }); // Actualiza el estado del formulario.
    };

    // Maneja el envío del formulario.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado del formulario.
       
        try {
            if (isRegistering) {
              // Si el usuario está registrándose, realiza una solicitud al endpoint de registro.
              await api.post("/auth/register",{
                  name: formData.name,
                  email: formData.email,
                  password: formData.password
              });
              setIsRegistering(false); // Cambia al modo de inicio de sesión tras registrarse.
            } else {
              // Si el usuario está iniciando sesión, realiza una solicitud al endpoint de login.
              const { data } = await api.post("/auth/login", {
                  email: formData.email,
                  password: formData.password
              });
            
            // Obtiene el nombre del usuario mediante el endpoint de búsqueda.
            localStorage.setItem("token", data.token); // Almacena el token en el almacenamiento local.

            const userResponse = await api.get(`/auth/user/search/email?email=${formData.email}`);
            localStorage.setItem("userName", userResponse.data.name);// Almacena el nombre del usuario en el almacenamiento local.
                
            onAuthSuccess(); // Llama a la función proporcionada para manejar un inicio de sesión exitoso.
            }
                
        }catch (error) {
            alert("Error al iniciar sesión");
            setError(error.response.data.message); // Maneja errores y actualiza el estado con el mensaje correspondiente.
        }
    }

return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {isRegistering && (
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          {isRegistering ? 'Registrarse' : 'Entrar'}
        </button>
        <p className="text-sm text-center mt-4">
          {isRegistering
            ? '¿Ya tienes cuenta? '
            : '¿No tienes cuenta? '}
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(''); // Limpiar errores al cambiar de modo
            }}
            className="text-blue-500 hover:underline"
          >
            {isRegistering ? 'Inicia sesión aquí' : 'Regístrate aquí'}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthForm;
