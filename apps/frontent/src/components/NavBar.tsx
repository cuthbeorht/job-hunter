import './NavBar.css'

export default function NavBar() {
  return (
    <nav className="navbar-wrapper">
    
        <div className="navbar-title">Job Hunter</div>
        <ul className="navbar-list">
          <li><a href="/" className="navbar-link">Home</a></li>
          <li><a href="/work-experience" className="navbar-link">Work Experience</a></li>
          <li><a href="/about" className="navbar-link">About</a></li>
          <li><a href="/contact" className="navbar-link">Contact</a></li>
        </ul>
      
    </nav>
  );
}