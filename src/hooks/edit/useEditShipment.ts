import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Shipment } from '../../types/ShipmentTypes';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const useEditShipment = (shipment: Shipment | null, onClose: () => void, onUpdate: (shipment: Shipment) => void) => {
  const [formShipment, setFormShipment] = useState<Shipment>({
    id: 0,
    ship_load_date: '',
    ship_pickup_location: '',
    ship_delivery_location: '',
    ship_driver: '',
    ship_weight: 0,
    ship_ftl_ltl: '',
    ship_equipment: '',
    ship_tarp: false,
    ship_price: 0,
    ship_notes: '',
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (shipment) {
      setFormShipment({
        id: shipment.id || 0,
        ship_load_date: shipment.ship_load_date || '',
        ship_pickup_location: shipment.ship_pickup_location || '',
        ship_delivery_location: shipment.ship_delivery_location || '',
        ship_driver: shipment.ship_driver || '',
        ship_weight: shipment.ship_weight || 0,
        ship_ftl_ltl: shipment.ship_ftl_ltl || '',
        ship_equipment: shipment.ship_equipment || '',
        ship_tarp: shipment.ship_tarp || false,
        ship_price: shipment.ship_price || 0,
        ship_notes: shipment.ship_notes || '',
        created_at: shipment.created_at || '',
        updated_at: shipment.updated_at || '',
      });
    }
  }, [shipment]);

  const updateShipment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || typeof token !== 'string') {
        Swal.fire({ icon: 'error', title: 'Unauthorized', text: 'Please log in again.' });
        return;
      }

      const response = await axios.put(`${API_URL}/shipment/${formShipment.id}`, formShipment, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({ icon: 'success', title: 'Updated!', text: 'Quote updated successfully.' });
      onUpdate(response.data);
      onClose();
    } catch (error: any) {
      console.error('Error updating quote:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to update quote.',
      });
    }
  };

  return {
    formShipment,
    setFormShipment,
    updateShipment,
  };
};

export default useEditShipment;
