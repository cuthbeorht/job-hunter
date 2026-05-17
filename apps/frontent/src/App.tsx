import Register from './components/Register';
import Login from './components/Login';
import Me from './components/Me';
import { useAuth } from './context/AuthContext';
import ExperienceItems from './components/ExperienceItems';
import NavBar from './components/NavBar';
import { Outlet } from 'react-router';

export default function App() {
  return (
    <div className="">
        <NavBar />
        <h1>Auth Demo</h1>

        <Outlet />
    </div>
  );
}