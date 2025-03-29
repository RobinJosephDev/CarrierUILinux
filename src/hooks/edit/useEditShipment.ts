import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Shipment } from '../../types/ShipmentTypes';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const useEditShipment = (shipment: Shipment | null, onClose: () => void) => {
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

  return {
    formShipment,
    setFormShipment,
  };
};

export default useEditShipment;
