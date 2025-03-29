import { useState } from 'react';
import { z } from 'zod';
import { Shipment } from '../../../types/ShipmentTypes';
import { useGoogleAutocomplete } from '../../../hooks/useGoogleAutocomplete';

declare global {
  interface Window {
    google?: any;
  }
}

interface ViewShipmentDetailsProps {
  formShipment: Readonly<Shipment>;
  setFormShipment: React.Dispatch<React.SetStateAction<Readonly<Shipment>>>;
}


const fields = [
  { key: 'ship_load_date', label: 'Load Date', type: 'date' },
  { key: 'ship_pickup_location', label: 'Pickup Location', placeholder: 'Enter pickup location', type: 'text' },
  { key: 'ship_delivery_location', label: 'Delivery Location', placeholder: 'Enter delivery location', type: 'text' },
  { key: 'ship_driver', label: 'Driver', placeholder: 'Enter driver name', type: 'text' },
  { key: 'ship_weight', label: 'Weight', placeholder: 'Enter shipment weight', type: 'number' },
  { key: 'ship_equipment', label: 'Equipment', placeholder: 'Enter equipment', type: 'text' },
  { key: 'ship_price', label: 'Price', placeholder: 'Enter price', type: 'number' },
  { key: 'ship_notes', label: 'Notes', placeholder: 'Enter notes', type: 'textarea' },
  { key: 'ship_tarp', label: 'TARP', type: 'boolean' },
];

const ViewShipmentDetails: React.FC<ViewShipmentDetailsProps> = ({ formShipment, setFormShipment }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});


  const validateAndSetShipment = (field: keyof Shipment, value: string | boolean) => {
    let sanitizedValue: string | boolean | number = value;

    if (field === 'ship_weight' || field === 'ship_price') {
      sanitizedValue = value ? Number(value) : '';
    }

    let error = '';
    const tempShipment = { ...formShipment, [field]: sanitizedValue };


    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormShipment(tempShipment);
  };

  return (
    <fieldset className="form-section">
      <div
        className="form-grid"
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div className="form-group" style={{ flex: '1 1 250px' }}>
          <label htmlFor="equipment">Load Type</label>
          <select
            id="equipment"
            value={formShipment.ship_ftl_ltl}
            onChange={(e) => setFormShipment((prevShipment) => ({ ...prevShipment, ship_ftl_ltl: e.target.value }))}
          >
            <option value="">Select...</option>
          </select>
          {errors.ship_ftl_ltl && (
            <span className="error" style={{ color: 'red' }}>
              {errors.ship_ftl_ltl}
            </span>
          )}
        </div>

        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key} className="form-group" style={{ flex: '1 1 250px' }}>
            {type === 'boolean' ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id={key}
                  checked={!!formShipment[key as keyof Shipment]}
                  onChange={(e) => validateAndSetShipment(key as keyof Shipment, e.target.checked)}
                  style={{ transform: 'scale(1.1)', cursor: 'pointer', margin: 0 }}
                />
                <label htmlFor={key} style={{ margin: 0, whiteSpace: 'nowrap' }}>
                  {label}
                </label>
              </div>
            ) : type === 'textarea' ? (
              <>
                <label htmlFor={key}>{label}</label>
                <textarea
                  id={key}
                  placeholder={placeholder}
                  value={String(formShipment[key as keyof Shipment] || '')}
                  onChange={(e) => validateAndSetShipment(key as keyof Shipment, e.target.value)}
                  style={{ marginTop: '1rem' }}
                />
              </>
            ) : (
              <>
                <label htmlFor={key}>{label}</label>
                <input
                  type={type}
                  id={key}
                  placeholder={placeholder}
                  value={String(formShipment[key as keyof Shipment] || '')}
                  onChange={(e) => validateAndSetShipment(key as keyof Shipment, e.target.value)}
                />
              </>
            )}
            {errors[key] && (
              <span className="error" style={{ color: 'red' }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default ViewShipmentDetails;
