import { useEffect, useRef } from 'react';

function QuoteDelivery({ setQuote, quote, delivery = {}, index, onChange, onRemove }) {
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

    // Extract the main address (street_number + route)
    const streetNumber = getComponent('street_number', '', addressComponents);
    const route = getComponent('route', '', addressComponents);
    const mainAddress = `${streetNumber} ${route}`.trim(); // Combine street number and route

    // Update the form customer state with the relevant values
    setQuote((prevQuote) => ({
      ...prevQuote,
      quote_delivery: prevQuote.quote_delivery.map((p, idx) =>
        idx === index
          ? {
              ...p,
              address: mainAddress,
              city: getComponent('locality', '', addressComponents),
              state: getComponent('administrative_area_level_1', '', addressComponents),
              country: getComponent('country', '', addressComponents),
              postal: getComponent('postal_code', '', addressComponents),
            }
          : p
      ),
    }));
  };

  const getComponent = (type, fallback, components) => {
    const component = components.find((c) => c.types.includes(type));
    return component ? component.long_name : fallback;
  };

  const handleQuoteChange = (e) => {
    const { name, value } = e.target;
    const updatedDelivery = { ...delivery, [name]: value };

    // Update the pickup information at the specific index
    onChange(index, updatedDelivery);
  };

  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Address</label>
        <input type="text" name="address" value={delivery.address || ''} onChange={handleQuoteChange} ref={addressRef} placeholder="Enter address" />
      </div>
      <div className="form-group">
        <label>City</label>
        <input type="text" name="city" value={delivery.city || ''} onChange={handleQuoteChange} />
      </div>
      <div className="form-group">
        <label>State</label>
        <input type="text" name="state" value={delivery.state || ''} onChange={handleQuoteChange} />
      </div>
      <div className="form-group">
        <label>Postal Code</label>
        <input type="tel" name="postal" value={delivery.postal || ''} onChange={handleQuoteChange} pattern="[0-9]{5}" maxLength="5" />
      </div>
      <div className="form-group">
        <label>Country</label>
        <input type="text" name="country" value={delivery.country || ''} onChange={handleQuoteChange} />
      </div>
      <div className="form-group">
        <label>Rate</label>
        <input type="number" name="rate" value={delivery.rate || ''} onChange={handleQuoteChange} placeholder="Enter rate" />
      </div>
      <div className="form-group">
        <label>Currency</label>
        <input type="text" name="currency" value={delivery.currency || ''} onChange={handleQuoteChange} placeholder="Enter currency code" />
      </div>
      <div className="form-group">
        <label>Equipment</label>
        <input type="text" name="equipment" value={delivery.equipment || ''} onChange={handleQuoteChange} placeholder="Enter equipment type" />
      </div>
      <div className="form-group">
        <label>Notes</label>
        <textarea name="notes" value={delivery.notes || ''} onChange={handleQuoteChange} placeholder="Enter notes" />
      </div>
      <div className="form-group">
        <label>Packages</label>
        <input type="number" name="packages" value={delivery.packages || ''} onChange={handleQuoteChange} placeholder="Enter number of packages" />
      </div>
      <div className="form-group">
        <label>Dimensions</label>
        <input
          type="text"
          name="dimensions"
          value={delivery.dimensions || ''}
          onChange={handleQuoteChange}
          placeholder="Enter dimensions (e.g., 20x20x20 cm)"
        />
      </div>

      <button type="button" onClick={() => onRemove(index)} className="remove">
        Remove
      </button>
    </div>
  );
}

export default QuoteDelivery;
