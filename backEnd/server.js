const express = require('express');
const connectDB = require('./config/db');

const PORT = process.env.PORT;
const app = express();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    connectDB();

});



