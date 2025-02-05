import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserContext } from '../../../UserProvider';
import EditShipmentDetails from './ViewShipmentDetails';

const ViewShipmentForm = ({ shipment, onClose, onUpdate }) => {
  const users = useContext(UserContext);
  const [formShipment, setFormShipment] = useState({
    id: '',
    ship_load_date: '',
    ship_pickup_location: '',
    ship_delivery_location: '',
    ship_driver: '',
    ship_weight: '',
    ship_ftl_ltl: '',
    ship_tarp: false,
    ship_equipment: '',
    ship_price: '',
    ship_notes: '',
  });
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (shipment) {
      console.log('Selected Shipment:', shipment);

      setFormShipment({
        id: shipment.id,
        ship_load_date: shipment.ship_load_date || '',
        ship_pickup_location: shipment.ship_pickup_location || '',
        ship_delivery_location: shipment.ship_delivery_location || '',
        ship_driver: shipment.ship_driver || '',
        ship_weight: shipment.ship_weight || '',
        ship_ftl_ltl: shipment.ship_ftl_ltl || '',
        ship_tarp: shipment.ship_tarp || false,
        ship_equipment: shipment.ship_equipment || '',
        ship_price: shipment.ship_price || '',
        ship_notes: shipment.ship_notes || '',
      });
    }
  }, [shipment]);

  const updateShipment = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You are not logged in. Please log in again.',
        });
        return;
      }

      const response = await axios.put(`${API_URL}/shipment/${formShipment.id}`, formShipment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Shipment data has been updated successfully.',
      });

      onUpdate(response.data); // Notify parent to update the shipment in the list
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating shipment:', error);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response && error.response.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to update shipment.',
      });
    }
  };

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateShipment();
        }}
        className="form-main"
      >
        <EditShipmentDetails formShipment={formShipment} setFormShipment={setFormShipment} />
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewShipmentForm;
