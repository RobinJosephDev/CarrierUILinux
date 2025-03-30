import { useState } from 'react';
import { z } from 'zod';
import { Shipment } from '../../../types/ShipmentTypes';
import { useGoogleAutocomplete } from '../../../hooks/useGoogleAutocomplete';

declare global {
  interface Window {
    google?: any;
  }
}

interface EditShipmentDetailsProps {
  formShipment: Shipment;
  setFormShipment: React.Dispatch<React.SetStateAction<Shipment>>;
}

const shipmentSchema = z.object({
  ship_load_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  ship_pickup_location: z
    .string()
    .max(150, 'Address too long')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  ship_delivery_location: z
    .string()
    .max(150, 'Address too long')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  ship_driver: z
    .string()
    .max(150, 'Driver name must be at most 150 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  ship_weight: z.number().positive('Weight must be a positive number').max(999999, 'Weight must not exceed 999,999').optional(),
  ship_ftl_ltl: z.enum(['FTL', 'LTL'], { message: 'Please select a valid load type' }),
  ship_equipment: z
    .string()
    .max(150, 'Equipment must be at most 150 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  ship_price: z.number().positive('Price must be a positive number').max(999999, 'Price must not exceed 999,999').optional(),
  ship_notes: z
    .string()
    .max(500, 'Notes cannot exceed 500 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  ship_tarp: z.boolean().optional(),
});

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

const EditShipmentDetails: React.FC<EditShipmentDetailsProps> = ({ formShipment, setFormShipment }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateAddressFields = (place: google.maps.places.PlaceResult, field: 'ship_pickup_location' | 'ship_delivery_location') => {
    const getComponent = (type: string) => place.address_components?.find((c) => c.types.includes(type))?.long_name || '';

    const fullAddress =
      place.formatted_address ||
      `${getComponent('street_number')} ${getComponent('route')}, ${getComponent('locality')}, 
       ${getComponent('administrative_area_level_1')} ${getComponent('postal_code')}, ${getComponent('country')}`;

    setFormShipment((prev) => ({
      ...prev,
      [field]: fullAddress,
    }));
  };

  const pickupAddressRef = useGoogleAutocomplete((place) => updateAddressFields(place, 'ship_pickup_location'));
  const deliveryAddressRef = useGoogleAutocomplete((place) => updateAddressFields(place, 'ship_delivery_location'));

  const loadTypeOptions = ['FTL', 'LTL'];

  const validateAndSetShipment = (field: keyof Shipment, value: string | boolean) => {
    let sanitizedValue: string | boolean | number = value;

    if (field === 'ship_weight' || field === 'ship_price') {
      sanitizedValue = value ? Number(value) : '';
    }

    let error = '';
    const tempShipment = { ...formShipment, [field]: sanitizedValue };
    const result = shipmentSchema.safeParse(tempShipment);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

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
            {loadTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
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
                  ref={key === 'ship_pickup_location' ? pickupAddressRef : key === 'ship_delivery_location' ? deliveryAddressRef : undefined}
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

export default EditShipmentDetails;
