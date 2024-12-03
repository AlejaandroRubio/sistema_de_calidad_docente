# Sistema de Calidad Docente

Este proyecto es una aplicación completa para la gestión de usuarios y encuestas, compuesta por un backend construido con Node.js y un frontend desarrollado con React.  

## Características principales

### Backend
- Gestión de usuarios:
  - Crear usuarios.
  - Iniciar sesión.
  - Actualizar y eliminar usuarios.
  - Obtener usuarios por ID o email.
- Gestión de encuestas:
  - Crear encuestas.
  - Listar todas las encuestas.
  - Buscar encuestas por ID o título.
  - Eliminar encuestas por ID.

### Frontend
- Formulario de autenticación para el registro y login de usuarios.
- Creación y edición de encuestas con título y descripción.
- Visualización de encuestas existentes.
- Gestión del perfil de usuario.
- Posibilidad de cerrar sesión.

---

## Estructura del proyecto

### Backend
La estructura del backend es la siguiente:

- **`controllers/`**  
  Contiene los controladores que gestionan la lógica del backend:  
  - `AuthController.js`: Maneja el CRUD de los usuarios y el inicio de sesión.  
  - `SurveyController.js`: Maneja el CRD de las encuestas.  

- **`middleware/`**  
  Incluye los middlewares del backend:  
  - `authMiddleware.js`: Verifica que el usuario tenga un token válido.  

- **`models/`**  
  Contiene los modelos de datos:  
  - `User.js`: Modelo de los usuarios.  
  - `Survey.js`: Modelo de las encuestas.  

- **`routes/`**  
  Define las rutas de la API:  
  - `auth.js`: Maneja las peticiones relacionadas con los usuarios.  
  - `surveys.js`: Maneja las peticiones relacionadas con las encuestas.  

- **`server.js`**  
  Archivo principal del servidor. Configura el middleware y las rutas.  

---

### Frontend
La estructura del frontend es la siguiente:

- **`components/`**  
  Contiene los componentes reutilizables de la aplicación:  
  - `AuthForm.js`: Formulario para iniciar sesión y registrar usuarios.  
  - `SurveyForm.js`: Formulario para crear y gestionar encuestas.  

- **`pages/`**  
  Contiene las páginas principales de la aplicación:  
  - `AuthPage.js`: Página que renderiza el formulario de autenticación.  
  - `SurveyPage.js`: Página para crear y gestionar encuestas.  

- **`api/`**  
  - `api.js`: Módulo que maneja las peticiones al backend.  

- **`App.js`**  
  Archivo principal de React que organiza las páginas.  

- **`index.js`**  
  Punto de entrada de la aplicación React, donde se renderiza `App.js`.


---

## Tecnologías utilizadas

### Backend
- **Express**: Framework para la creación de servidores web.
- **Mongoose**: Biblioteca para modelado de datos en MongoDB.
- **JWT (jsonwebtoken)**: Autenticación basada en tokens.
- **bcrypt**: Utilizado para el hash de contraseñas.
- **dotenv**: Manejo de variables de entorno.
- **cors**: Habilitación de CORS en el servidor.
- **body-parser**: Procesamiento de cuerpos de solicitudes HTTP.
- **nodemon**: Herramienta para desarrollo que reinicia automáticamente el servidor.

### Frontend
- **React**: Biblioteca para la construcción de interfaces de usuario.
- **React Router DOM**: Manejo de rutas en aplicaciones React.
- **Axios**: Cliente HTTP para realizar solicitudes al backend.
- **Testing Library**: Herramientas para pruebas en React.
- **Web Vitals**: Métricas de rendimiento para aplicaciones web.


---
### [Diagramas](diagrams)



