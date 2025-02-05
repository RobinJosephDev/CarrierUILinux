import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserContext } from '../../../UserProvider';
import EditQuoteGeneral from './EditQuoteGeneral';
import EditQuotePickup from './EditQuotePickup';
import EditQuoteDelivery from './EditQuoteDelivery';

const EditQuoteForm = ({ quote, onClose, onUpdate }) => {
  const users = useContext(UserContext);
  const [formQuote, setFormQuote] = useState({
    id: '',
    quote_type: '',
    quote_customer: '',
    quote_cust_ref_no: '',
    quote_booked_by: '',
    quote_temperature: '',
    quote_hot: false,
    quote_team: false,
    quote_air_ride: false,
    quote_tarp: false,
    quote_hazmat: false,
    quote_pickup: [{ address: '', city: '', state: '', country: '', postal: '' }],
    quote_delivery: [
      { address: '', city: '', state: '', country: '', postal: '', rate: '', currency: '', equipment: '', notes: '', packages: '', dimensions: '' },
    ],
  });
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (quote) {
      const parsedPickups = Array.isArray(quote.quote_pickup) ? quote.quote_pickup : JSON.parse(quote.quote_pickup || '[]');
      const parsedDeliveries = Array.isArray(quote.quote_delivery) ? quote.quote_delivery : JSON.parse(quote.quote_delivery || '[]');
      setFormQuote({
        ...quote,
        quote_pickup: parsedPickups,
        quote_delivery: parsedDeliveries,
      });
    }
  }, [quote]);

  const handlePickupChange = (index, updatedPickup) => {
    const updatedPickups = formQuote.quote_pickup.map((pickup, i) => (i === index ? updatedPickup : pickup));
    setFormQuote((prevQuote) => ({
      ...prevQuote,
      quote_pickup: updatedPickups,
    }));
  };

  const handleRemovePickup = (index) => {
    setFormQuote((prevQuote) => ({
      ...prevQuote,
      quote_pickup: prevQuote.quote_pickup.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveDelivery = (index) => {
    setFormQuote((prevQuote) => ({
      ...prevQuote,
      quote_delivery: prevQuote.quote_delivery.filter((_, i) => i !== index),
    }));
  };

  const handleDeliveryChange = (index, updatedQuote) => {
    const updatedPickups = formQuote.quote_delivery.map((quote_delivery, i) => (i === index ? updatedQuote : quote_delivery));
    setFormQuote((prevQuote) => ({
      ...prevQuote,
      quote_delivery: updatedPickups,
    }));
  };
  const validateQuote = () => {
    return formQuote.quote_type;
  };
  const updateQuote = async () => {
    if (validateQuote()) {

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

      const response = await axios.put(`${API_URL}/quote/${formQuote.id}`, formQuote, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Quote data has been updated successfully.',
      });
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating quote:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response && error.response.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to update customer.',
      });
    }
  };
  }
  const handleAddPickup = () => {
    setFormQuote((prevQuote) => ({
      ...prevQuote,
      quote_pickup: [...prevQuote.quote_pickup, { address: '', city: '', state: '', country: '', postal: '' }],
    }));
  };

  const handleAddDelivery = () => {
    setFormQuote((prevQuote) => ({
      ...prevQuote,
      quote_delivery: [
        ...prevQuote.quote_delivery,
        { address: '', city: '', state: '', country: '', postal: '', rate: '', currency: '', equipment: '', notes: '', packages: '', dimensions: '' },
      ],
    }));
  };

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateQuote();
        }}
        className="form-main"
      >
        <EditQuoteGeneral formQuote={formQuote} setFormQuote={setFormQuote} />
        <fieldset className="form-section">
          <legend>Pickup</legend>
          <div className="form-row">
            {formQuote.quote_pickup.map((pickup, index) => (
              <EditQuotePickup
                key={index}
                formQuote={formQuote}
                setFormQuote={setFormQuote}
                pickup={pickup}
                index={index}
                onChange={handlePickupChange}
                onRemove={handleRemovePickup}
              />
            ))}
            <button type="button" onClick={handleAddPickup} className="add">
              Add Pickup
            </button>
          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Delivery</legend>
          <div className="form-row">
            {Array.isArray(formQuote.quote_delivery) && formQuote.quote_delivery.length > 0 ? (
              formQuote.quote_delivery.map((delivery, index) => (
                <EditQuoteDelivery
                  key={index}
                  formQuote={formQuote}
                  setFormQuote={setFormQuote}
                  delivery={delivery}
                  index={index}
                  onChange={handleDeliveryChange}
                  onRemove={handleRemoveDelivery}
                />
              ))
            ) : (
              <p>No deliveries available</p>
            )}
            <button type="button" onClick={handleAddDelivery} className="add">
              Add Delivery
            </button>
          </div>
        </fieldset>
        <button type="submit" className="btn-submit">
          Update Lead
        </button>
      </form>
    </div>
  );
};

export default EditQuoteForm;
