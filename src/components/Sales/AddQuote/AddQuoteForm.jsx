import { useContext, useState } from 'react';
import { UserContext } from '../../../UserProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../../styles/Form.css';
import QuoteGeneral from './QuoteGeneral';
import QuotePickup from './QuotePickup';
import QuoteDelivery from './QuoteDelivery';

const AddQuoteForm = ({ onClose, onAddQuote }) => {
  const { currentUser } = useContext(UserContext);
  const [quote, setQuote] = useState({
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
    quote_pickup: [],
    quote_delivery: [],
  });
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handlePickupChange = (index, updatedPickup) => {
    // Update the specific pickup in the quote
    const updatedPickups = [...quote.quote_pickup];
    updatedPickups[index] = updatedPickup;
    setQuote({ ...quote, quote_pickup: updatedPickups });
  };

  const handleRemovePickup = (index) => {
    const updatedPickups = quote.quote_pickup.filter((_, i) => i !== index);
    setQuote({ ...quote, quote_pickup: updatedPickups });
  };

  const handleDeliveryChange = (index, updatedDelivery) => {
    // When a contact changes, update the specific contact in the contacts array
    const updatedDeliverys = [...quote.quote_delivery];
    updatedDeliverys[index] = updatedDelivery;
    setQuote({ ...quote, quote_delivery: updatedDeliverys });
  };

  const handleRemoveDelivery = (index) => {
    const updatedDeliverys = quote.quote_delivery.filter((_, i) => i !== index);
    setQuote({ ...quote, quote_delivery: updatedDeliverys });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validateQuote = () => {
      return quote.quote_type;
    };

    if (validateQuote()) {
      try {
        let response;
        const token = localStorage.getItem('token');

        if (!token) {
          Swal.fire('Error', 'No token found', 'error');
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        if (quote.id) {
          response = await axios.put(`${API_URL}/quote/${quote.id}`, quote, { headers });
          Swal.fire('Updated!', 'Quote data has been updated successfully.', 'success');
        } else {
          response = await axios.post(`${API_URL}/quote`, quote, {
            headers,
          });
          Swal.fire('Saved!', 'Quote data has been saved successfully.', 'success');
        }

        onAddQuote(response.data);
        clearQuoteForm();
        onClose();
      } catch (error) {
        console.error('Error saving/updating quote:', error.response ? error.response.data : error.message);
        Swal.fire('Error', 'An error occurred while saving/updating the quote.', 'error');
      }
    } else {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
    }
  };

  const clearQuoteForm = () => {
    setQuote({
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
      quote_pickup: [],
      quote_delivery: [],
    });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-main">
        <div className="submit-button-container">
          <QuoteGeneral quote={quote} setQuote={setQuote} />
          <fieldset className="form-section">
            <legend>Pickup</legend>
            <div className="form-row">
              {quote.quote_pickup.map((pickup, index) => (
                <QuotePickup
                  key={index}
                  quote={quote}
                  setQuote={setQuote}
                  pickup={pickup}
                  index={index}
                  onChange={handlePickupChange}
                  onRemove={handleRemovePickup}
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  setQuote((prevQuote) => ({
                    ...prevQuote,
                    quote_pickup: [...prevQuote.quote_pickup, { address: '', city: '', state: '', postal: '' }],
                  }))
                }
                className="add"
              >
                Add Pickup
              </button>
            </div>
          </fieldset>
          <fieldset className="form-section">
            <legend>Delivery</legend>
            <div className="form-row">
              {quote.quote_delivery.map((delivery, index) => (
                <QuoteDelivery
                  key={index}
                  quote={quote}
                  setQuote={setQuote}
                  delivery={delivery}
                  index={index}
                  onChange={handleDeliveryChange}
                  onRemove={handleRemoveDelivery}
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  setQuote((prevQuote) => ({
                    ...prevQuote,
                    quote_delivery: [
                      ...prevQuote.quote_delivery,
                      {
                        address: '',
                        city: '',
                        state: '',
                        country: '',
                        postal: '',
                        rate: '',
                        currency: '',
                        equipment: '',
                        notes: '',
                        packages: '',
                        dimensions: '',
                      },
                    ],
                  }))
                }
                className="add"
              >
                Add Delivery
              </button>
            </div>
          </fieldset>
          <button type="submit" className="btn-submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuoteForm;
