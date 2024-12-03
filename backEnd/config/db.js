const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Carga las variables de entorno desde el archivo .env.

const connectDB = async () => { // Define una función asincrónica para conectar a la base de datos.
  try {
    // Intenta conectarse a la base de datos usando la URI proporcionada en las variables de entorno.
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Utiliza el nuevo analizador de URL de MongoDB.
      useUnifiedTopology: true, // Utiliza el nuevo motor de topología unificada de MongoDB.
    });
    console.log('MongoDB conectado en ' + process.env.MONGO_URI); // Imprime en consola si la conexión es exitosa.
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error.message);// Imprime el mensaje de error si la conexión falla.
    process.exit(1); // Finaliza el proceso con un código de error 1 si la conexión falla.
  }
};

module.exports = connectDB; // Exporta la función de conexión para ser utilizada en otros archivos.