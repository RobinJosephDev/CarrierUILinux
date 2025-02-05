import { useEffect, useRef } from 'react';

function EditQuotePickup({ pickup, index, onChange, onRemove }) {
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
      ...pickup,
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

  const handlePickupChange = (e) => {
    const { name, value } = e.target;
    const updatedPickup = { ...pickup, [name]: value };
    onChange(index, updatedPickup);
  };

  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={pickup.address} // Use pickup's value
          onChange={handlePickupChange}
          ref={addressRef}
          placeholder="Enter your address"
        />
      </div>
      <div className="form-group">
        <label>City</label>
        <input
          type="text"
          name="city"
          value={pickup.city} // Use pickup's value
          onChange={handlePickupChange}
        />
      </div>
      <div className="form-group">
        <label>State</label>
        <input
          type="text"
          name="state"
          value={pickup.state} // Use pickup's value
          onChange={handlePickupChange}
        />
      </div>
      <div className="form-group">
        <label>Postal Code</label>
        <input
          type="text"
          name="postal"
          value={pickup.postal} // Use pickup's value
          onChange={handlePickupChange}
        />
      </div>
      <div className="form-group">
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={pickup.country} // Use pickup's value
          onChange={handlePickupChange}
        />
      </div>

      <button type="button" onClick={() => onRemove(index)} className="remove">
        Remove
      </button>
    </div>
  );
}

export default EditQuotePickup;
