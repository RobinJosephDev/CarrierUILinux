import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Quote, Location } from '../../types/QuoteTypes';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const useAddQuote = (onClose: () => void, onSuccess: () => void) => {
  const initialQuoteState: Quote = {
    id: 0,
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
    created_at: '',
    updated_at: '',
  };

  const [quote, setQuote] = useState<Quote>(initialQuoteState);

  //Validation
  const validateQuote = (): boolean => {
    return !!quote.quote_type && !!quote.quote_customer;
  };

  // Handle Submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateQuote()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Error', 'No token found', 'error');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const response = quote.id
        ? await axios.put(`${API_URL}/quote/${quote.id}`, quote, { headers })
        : await axios.post(`${API_URL}/quote`, quote, { headers });

      Swal.fire(quote.id ? 'Success!' : 'Saved!', 'Quote created successfully.', 'success');
      clearQuoteForm();
      onSuccess();
    } catch (error: any) {
      console.error('Error saving/updating quote:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'An error occurred while processing the quote.', 'error');
    }
  };

  //Clear Form
  const clearQuoteForm = (): void => {
    setQuote({
      id: 0,
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
      created_at: '',
      updated_at: '',
    });
  };

  // Pickup
  const handleAddPickup = () => {
    setQuote((prev) => ({
      ...prev,
      quote_pickup: [
        ...prev.quote_pickup,
        {
          address: '',
          city: '',
          state: '',
          postal: '',
          country: '',
          date: '',
          time: '',
          currency: '',
          equipment: '',
          pickup_po: '',
          phone: '',
          packages: 0,
          weight: 0,
          dimensions: '',
          notes: '',
        },
      ],
    }));
  };

  const handleRemovePickup = (index: number) => {
    setQuote((prevQuote) => ({
      ...prevQuote,
      quote_pickup: prevQuote.quote_pickup.filter((_, i) => i !== index),
    }));
  };

  const handlePickupChange = (index: number, updatedPickup: Location) => {
    const updatedPickups = quote.quote_pickup.map((pickup, i) => (i === index ? updatedPickup : pickup));
    setQuote((prevQuote) => ({
      ...prevQuote,
      quote_pickup: updatedPickups,
    }));
  };

  //Delivery
  const handleAddDelivery = () => {
    setQuote((prev) => ({
      ...prev,
      quote_delivery: [
        ...prev.quote_delivery,
        {
          address: '',
          city: '',
          state: '',
          postal: '',
          country: '',
          date: '',
          time: '',
          currency: '',
          equipment: '',
          pickup_po: '',
          phone: '',
          packages: 0,
          weight: 0,
          dimensions: '',
          notes: '',
        },
      ],
    }));
  };

  const handleRemoveDelivery = (index: number) => {
    setQuote((prevQuote) => ({
      ...prevQuote,
      quote_delivery: prevQuote.quote_delivery.filter((_, i) => i !== index),
    }));
  };

  const handleDeliveryChange = (index: number, updatedDelivery: Location) => {
    const updatedDeliveries = quote.quote_delivery.map((delivery, i) => (i === index ? updatedDelivery : delivery));
    setQuote((prevQuote) => ({
      ...prevQuote,
      quote_delivery: updatedDeliveries,
    }));
  };

  return {
    quote,
    setQuote,
    handleSubmit,
    clearQuoteForm,
    handleAddPickup,
    handlePickupChange,
    handleRemovePickup,
    handleAddDelivery,
    handleDeliveryChange,
    handleRemoveDelivery,
  };
};

export default useAddQuote;
