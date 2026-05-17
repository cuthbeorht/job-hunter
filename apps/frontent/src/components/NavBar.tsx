import { Link } from 'react-router';
import './NavBar.css'
import Profile from './Profile';

export default function NavBar() {
  return (
    <nav className="navbar-wrapper">
    
        <div className="navbar-title">Job Hunter</div>
        <ul className="navbar-list">
          <li><Link to="/" className="navbar-link">Home</Link></li>
          <li><Link to="/work-experiences" className="navbar-link">Work Experience</Link></li>
          <li><Profile /></li>
          {/* <li><Link to="/about" className="navbar-link">About</Link></li> */}
          {/* <li><Link to="/contact" className="navbar-link">Contact</Link></li> */}
        </ul>
      
    </nav>
  );
}