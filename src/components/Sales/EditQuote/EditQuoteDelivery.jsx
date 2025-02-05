import { useEffect, useRef } from 'react';

function EditQuoteDelivery({ delivery, index, onChange, onRemove }) {
  const addressRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsApi = () => {
      if (window.google && window.google.maps) {
        initializeAutocomplete();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          initializeAutocomplete();
        }
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsApi();
  }, []);

  const initializeAutocomplete = () => {
    const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
      types: ['address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place || !place.address_components) {
        console.error('No valid address selected');
        return;
      }
      updateAddressFields(place);
    });
  };

  const updateAddressFields = (place) => {
    const addressComponents = place.address_components;
    const streetNumber = getComponent('street_number', '', addressComponents);
    const route = getComponent('route', '', addressComponents);
    const mainAddress = `${streetNumber} ${route}`.trim(); // Combine street number and route

    onChange(index, {
      ...delivery,
      address: mainAddress,
      city: getComponent('locality', '', addressComponents),
      state: getComponent('administrative_area_level_1', '', addressComponents),
      country: getComponent('country', '', addressComponents),
      postal: getComponent('postal_code', '', addressComponents),
    });
  };

  const getComponent = (type, fallback, components) => {
    const component = components.find((c) => c.types.includes(type));
    return component ? component.long_name : fallback;
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    const updatedPickup = { ...delivery, [name]: value };
    onChange(index, updatedPickup);
  };

  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Address</label>
        <input type="text" name="address" value={delivery.address} onChange={handleDeliveryChange} ref={addressRef} placeholder="Enter address" />
      </div>
      <div className="form-group">
        <label>City</label>
        <input type="text" name="city" value={delivery.city} onChange={handleDeliveryChange} />
      </div>
      <div className="form-group">
        <label>State</label>
        <input type="text" name="state" value={delivery.state} onChange={handleDeliveryChange} />
      </div>
      <div className="form-group">
        <label>Postal Code</label>
        <input type="tel" name="postal" value={delivery.postal} onChange={handleDeliveryChange} pattern="[0-9]{5}" maxLength="5" />
      </div>
      <div className="form-group">
        <label>Country</label>
        <input type="text" name="country" value={delivery.country} onChange={handleDeliveryChange} />
      </div>
      <div className="form-group">
        <label>Rate</label>
        <input type="number" name="rate" value={delivery.rate} onChange={handleDeliveryChange} placeholder="Enter rate" />
      </div>
      <div className="form-group">
        <label>Currency</label>
        <input type="text" name="currency" value={delivery.currency} onChange={handleDeliveryChange} placeholder="Enter currency code" />
      </div>
      <div className="form-group">
        <label>Equipment</label>
        <input type="text" name="equipment" value={delivery.equipment} onChange={handleDeliveryChange} placeholder="Enter equipment type" />
      </div>
      <div className="form-group">
        <label>Notes</label>
        <textarea name="notes" value={delivery.notes} onChange={handleDeliveryChange} placeholder="Enter notes" />
      </div>
      <div className="form-group">
        <label>Packages</label>
        <input type="number" name="packages" value={delivery.packages} onChange={handleDeliveryChange} placeholder="Enter number of packages" />
      </div>
      <div className="form-group">
        <label>Dimensions</label>
        <input
          type="text"
          name="dimensions"
          value={delivery.dimensions}
          onChange={handleDeliveryChange}
          placeholder="Enter dimensions (e.g., 20x20x20 cm)"
        />
      </div>

      <button type="button" onClick={() => onRemove(index)} className="remove">
        Remove
      </button>
    </div>
  );
}

export default EditQuoteDelivery;
