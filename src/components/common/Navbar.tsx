import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserProvider';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../../styles/Navbar.css';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FiClipboard, FiUsers, FiLogOut } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CustomNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, setUserRole } = useUser();

  const handleLogout = async (): Promise<void> => {
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (error) {
      console.error('Logout failed', error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUserRole(null);

    Swal.fire({
      title: 'Logged Out',
      text: 'You have been successfully logged out.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      navigate('/login', { replace: true });
    });
  };

  useEffect(() => {
    if (!userRole) {
      navigate('/login', { replace: true });
    }
  }, [userRole, navigate]);

  if (!userRole) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Navbar.Brand as={NavLink} to="/">
        Sealink Logistics
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <Nav.Link as={NavLink} to="/quote">
            <FiClipboard className="nav-icon" /> Quotes
          </Nav.Link>
          <Nav.Link as={NavLink} to="/shipment">
            <FiUsers className="nav-icon" /> Advertise Shipment
          </Nav.Link>
          <Nav.Link onClick={handleLogout}>
            <FiLogOut className="nav-icon" /> Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
