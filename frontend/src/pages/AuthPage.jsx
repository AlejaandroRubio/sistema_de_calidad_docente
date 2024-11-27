import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

function AuthPage() {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/encuestas'); // Redirigir al usuario tras iniciar sesión
  };

  return (
    <div>
      <AuthForm onAuthSuccess={handleAuthSuccess} />
    </div>
  );
}

export default AuthPage;
