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