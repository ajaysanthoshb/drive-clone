import React from 'react';
import {Navbar,Nav} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import '../styling/navbarStyling.css';

export default function NavbarComponent() {
    return (
        <nav className="navContainer navbar-expand navbar-light navbg">
            <Link to = "/" className="cloudstorage">
                CLOUD STORAGE
            </Link>
            <Link to="/user" className="navlink">
                PROFILE
            </Link>
        </nav>
    )
}
