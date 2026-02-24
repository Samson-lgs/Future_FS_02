import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiUsers, FiLogOut, FiUser } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <FiUsers className="logo-icon" />
            <span>Lead CRM</span>
          </Link>
          
          {user && (
            <nav className="nav">
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/leads" className="nav-link">Leads</Link>
              
              <div className="user-menu">
                <div className="user-info">
                  <FiUser />
                  <span>{user.name}</span>
                </div>
                <button onClick={handleLogout} className="btn-logout">
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
