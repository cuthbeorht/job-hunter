import Register from './components/Register';
import Login from './components/Login';
import Me from './components/Me';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { token } = useAuth();

  return (
    <div className="container">
      <h1>Auth Demo</h1>

      {!token && (
        <div className="row">
          <Register />
          <Login />
        </div>
      )}

      <Me />
    </div>
  );
}