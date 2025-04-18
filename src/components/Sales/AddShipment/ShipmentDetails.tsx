import { useState } from 'react';
import { z } from 'zod';
import { Shipment } from '../../../types/ShipmentTypes';
import { useGoogleAutocomplete } from '../../../hooks/useGoogleAutocomplete';

declare global {
  interface Window {
    google?: any;
  }
}

interface ShipmentDetailsProps {
  shipment: Shipment;
  setShipment: React.Dispatch<React.SetStateAction<Shipment>>;
}

const shipmentSchema = z.object({
  ship_load_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
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
  ship_weight: z
    .string()
    .max(20, 'Weight cannot exceed 20 characters')
    .regex(/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/, 'Enter a valid amount (e.g., 1000, 1,000.50)')
    .optional(),
  ship_ftl_ltl: z.enum(['FTL', 'LTL'], { message: 'Please select a valid load type' }).optional(),
  ship_equipment: z
    .string()
    .max(150, 'Equipment must be at most 150 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  ship_price: z
    .string()
    .max(20, 'Price cannot exceed 20 characters')
    .regex(/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/, 'Enter a valid amount (e.g., 1000, 1,000.50)')
    .optional(),
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
  { key: 'ship_weight', label: 'Weight', placeholder: 'Enter shipment weight', type: 'text' },
  { key: 'ship_equipment', label: 'Equipment', placeholder: 'Enter equipment', type: 'text' },
  { key: 'ship_price', label: 'Price', placeholder: 'Enter price', type: 'text' },
  { key: 'ship_notes', label: 'Notes', placeholder: 'Enter notes', type: 'textarea' },
  { key: 'ship_tarp', label: 'TARP', type: 'boolean' },
];

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ shipment, setShipment }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateAddressFields = (place: google.maps.places.PlaceResult, field: 'ship_pickup_location' | 'ship_delivery_location') => {
    const getComponent = (type: string) => place.address_components?.find((c) => c.types.includes(type))?.long_name || '';

    const fullAddress =
      place.formatted_address ||
      `${getComponent('street_number')} ${getComponent('route')}, ${getComponent('locality')}, 
       ${getComponent('administrative_area_level_1')} ${getComponent('postal_code')}, ${getComponent('country')}`;

    setShipment((prev) => ({
      ...prev,
      [field]: fullAddress,
    }));
  };

  const pickupAddressRef = useGoogleAutocomplete((place) => updateAddressFields(place, 'ship_pickup_location'));
  const deliveryAddressRef = useGoogleAutocomplete((place) => updateAddressFields(place, 'ship_delivery_location'));

  const loadTypeOptions = ['FTL', 'LTL'];

  const validateAndSetShipment = (field: keyof Shipment, value: string | boolean) => {
    let sanitizedValue: string | boolean | number = value;
    let transformedValue = sanitizedValue;

    if (field === 'ship_weight' || (field === 'ship_price' && typeof sanitizedValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(sanitizedValue))) {
      transformedValue = sanitizedValue;
    }

    const tempShipment = { ...shipment, [field]: transformedValue };
    const result = shipmentSchema.safeParse(tempShipment);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }

    setShipment(tempShipment);
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
            value={shipment.ship_ftl_ltl}
            onChange={(e) => setShipment((prevShipment) => ({ ...prevShipment, ship_ftl_ltl: e.target.value }))}
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
                  checked={!!shipment[key as keyof Shipment]}
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
                  value={String(shipment[key as keyof Shipment] || '')}
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
                  value={String(shipment[key as keyof Shipment] || '')}
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

export default ShipmentDetails;
