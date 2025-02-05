import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserProvider';
import Swal from 'sweetalert2';
import axios from 'axios';

const Logout = () => {
  const navigate = useNavigate(); // Use useNavigate for routing
  const { setUserRole } = useUser(); // Access setUserRole from useUser
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = async () => {
    // Confirmation dialog before logout
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

        // Clear user data from localStorage and context
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setUserRole(null); // Reset user role in context

        // Redirect to login page
        navigate('/login');
        Swal.fire('Logged out!', 'You have been logged out successfully.', 'success'); // Success message
      } catch (error) {
        console.error('Logout failed:', error);
        Swal.fire('Error!', 'Failed to log out. Please try again later.', 'error'); // Error feedback
      }
    }
  };

  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Logout;
