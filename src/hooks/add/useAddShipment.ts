import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Shipment } from '../../types/ShipmentTypes';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const useAddShipment = (onClose: () => void, onSuccess: () => void) => {
  const initialQuoteState: Shipment = {
    id: 0,
    ship_load_date: '',
    ship_pickup_location: '',
    ship_delivery_location: '',
    ship_driver: '',
    ship_weight: 0,
    ship_ftl_ltl: '',
    ship_tarp: false,
    ship_equipment: '',
    ship_price: 0,
    ship_notes: '',
    created_at: '',
    updated_at: '',
  };

  const [shipment, setShipment] = useState<Shipment>(initialQuoteState);

  // Handle Submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Error', 'No token found', 'error');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const response = shipment.id
        ? await axios.put(`${API_URL}/shipment/${shipment.id}`, shipment, { headers })
        : await axios.post(`${API_URL}/shipment`, shipment, { headers });

      Swal.fire(shipment.id ? 'Success!' : 'Saved!', 'Shipment created successfully.', 'success');
      clearShipmentForm();
      onSuccess();
    } catch (error: any) {
      console.error('Error saving/updating shipment:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'An error occurred while processing the shipment.', 'error');
    }
  };

  //Clear Form
  const clearShipmentForm = (): void => {
    setShipment({
        id: 0,
        ship_load_date: '',
        ship_pickup_location: '',
        ship_delivery_location: '',
        ship_driver: '',
        ship_weight: 0,
        ship_ftl_ltl: '',
        ship_tarp: false,
        ship_equipment: '',
        ship_price: 0,
        ship_notes: '',
        created_at: '',
        updated_at: '',
    });
  };

  return {
    shipment,
    setShipment,
    handleSubmit,
    clearShipmentForm,
  };
};

export default useAddShipment;
