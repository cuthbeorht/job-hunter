import Register from './components/Register';
import Login from './components/Login';
import Me from './components/Me';
import { useAuth } from './context/AuthContext';
import ExperienceItems from './components/ExperienceItems';

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

      {token && (
        <div>
            <Me />
            <ExperienceItems />
        </div>
      )}
    </div>
  );
}