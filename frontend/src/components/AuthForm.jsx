import { useState } from "react";
import api from "../services/api";

function AuthForm({ onAuthSuccess }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        try {
            if (isRegistering) {
                await api.post("/auth/register",{
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                setIsRegistering(false);
            } else {
                const { data } = await api.post("/auth/login", {
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem("token", data.token);
                onAuthSuccess();
            }
                
        }catch (error) {
            setError(error.response.data.message);
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
