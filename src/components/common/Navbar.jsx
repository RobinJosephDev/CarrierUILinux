import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserProvider';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../../styles/Navbar.css';
// ✅ Import Bootstrap components
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

// ✅ Import icons
import { FiClipboard, FiUsers, FiLogOut } from 'react-icons/fi';

function CustomNavbar() {
  const navigate = useNavigate();
  const { setUserRole } = useUser();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to log back in!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log me out!',
      cancelButtonText: 'No, stay logged in',
    });

    if (result.isConfirmed) {
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

        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setUserRole(null);
        navigate('/login');
      } catch (error) {
        Swal.fire('Error!', 'Failed to log out. Please try again later.', 'error');
      }
    }
  };

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
}

export default CustomNavbar;
