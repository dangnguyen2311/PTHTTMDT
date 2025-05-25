// src/components/Navbar.jsx
function Navbar() {
    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            <ul className="navbar-nav">
                <li className="nav-item"><a className="nav-link" data-widget="pushmenu" href="#"><i className="fas fa-bars"></i></a></li>
                <li className="nav-item d-none d-sm-inline-block"><a href="/" className="nav-link">Home</a></li>
                <li className="nav-item d-none d-sm-inline-block"><a href="https://www.facebook.com/" className="nav-link">Contact</a></li>
                <li className="nav-item d-none d-sm-inline-block"><a href="/logout" className="nav-link">Logout</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;
