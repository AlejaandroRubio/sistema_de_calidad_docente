const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const PORT = process.env.PORT; // Obtiene el puerto del entorno de ejecución.
dotenv.config(); // Carga las variables de entorno desde el archivo .env.

const authRoutes = require('./routes/auth'); // Importa las rutas de autenticación.
const surveyRoutes = require('./routes/surveys'); // Importa las rutas de encuestas.

const app = express(); // Crea una instancia de la aplicación Express.

app.use(cors()); // Habilita CORS para permitir solicitudes de diferentes orígenes.
app.use(bodyParser.json());// Configura el middleware para parsear el cuerpo de las solicitudes en formato JSON.

app.use('/api/auth', authRoutes); // Define las rutas de autenticación con el prefijo '/api/auth'.
app.use('/api/survey', surveyRoutes); // Define las rutas de encuestas con el prefijo '/api/survey'.

app.get('/', (req, res) => { // Ruta raíz que responde con un mensaje de estado.
    res.send('API running'); // Envia la respuesta al cliente.
});

// Inicia el servidor en el puerto especificado.
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`); // Mensaje en consola al iniciar el servidor.
    connectDB(); // Conecta la base de datos.

});



