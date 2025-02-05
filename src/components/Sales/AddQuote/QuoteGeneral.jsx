import Select from 'react-select';
import { useEffect, useState } from 'react';
import axios from 'axios';

function QuoteGeneral({ quote, setQuote }) {
  const [customers, setCustomers] = useState([]);
  const [customerRefNos, setCustomerRefNos] = useState([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch customers and their reference numbers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token'); // Adjust based on where you store the token

        const { data } = await axios.get(`${API_URL}/customer`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
          },
        });

        console.log('Fetched customers:', data); // Debugging the fetched data

        // Transform data into the required format for react-select
        const formattedCustomers = data.map((quote_customer) => ({
          value: quote_customer.cust_name, // Ensure 'value' is set to 'customer.id'
          label: quote_customer.cust_name, // Label to display
          refNo: quote_customer.cust_ref_no, // Reference number
        }));

        setCustomers(formattedCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  // Update customer reference numbers based on the selected customer
  useEffect(() => {
    if (quote.quote_customer) {
      const selectedCustomer = customers.find((c) => c.value === quote.quote_customer);
      setCustomerRefNos(selectedCustomer ? [{ value: selectedCustomer.refNo, label: selectedCustomer.refNo }] : []);
    } else {
      setCustomerRefNos([]);
    }
  }, [quote.quote_customer, customers]);

  const quoteTypeOptions = ['FTL', 'LTL'];
  return (
    <fieldset className="form-section">
      <legend>General</legend>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="creditStatus">Quote Type*</label>
          <select
            name="creditStatus"
            value={quote.quote_type}
            onChange={(e) =>
              setQuote({
                ...quote,
                quote_type: e.target.value,
              })
            }
            required
          >
            <option value="">Select..</option>
            {quoteTypeOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="quote_customer">Customer</label>
          <Select
            id="quote_customer"
            options={customers}
            value={customers.find((c) => c.value === quote.quote_customer) || null}
            onChange={(selected) => {
              console.log('Selected customer:', selected); // Debugging selected customer
              setQuote({ ...quote, quote_customer: selected ? selected.value : '' });
            }}
            placeholder="Select a customer"
            isClearable
          />
        </div>
        <div className="form-group">
          <label htmlFor="customerRefNo">Customer Ref. No</label>
          <Select
            id="customerRefNo"
            options={customerRefNos}
            value={customerRefNos.find((c) => c.value === quote.quote_cust_ref_no) || null}
            onChange={(selected) => {
              console.log('Selected refNo:', selected); // Debugging selected refNo
              setQuote({ ...quote, quote_cust_ref_no: selected ? selected.value : '' });
            }}
            placeholder="Select a reference number"
            isClearable
          />
        </div>
        <div className="form-group">
          <label htmlFor="accNo">Booked By</label>
          <input type="text" value={quote.quote_booked_by} onChange={(e) => setQuote({ ...quote, quote_booked_by: e.target.value })} id="accNo" />
        </div>
        <div className="form-group">
          <label htmlFor="branch">Temperature</label>
          <input
            type="text"
            value={quote.quote_temperature}
            onChange={(e) => setQuote({ ...quote, quote_temperature: e.target.value })}
            id="branch"
          />
        </div>

        <div className="form-group">
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            Hot
            <input
              type="checkbox"
              id="creditApplication"
              checked={quote.quote_hot}
              onChange={(e) =>
                setQuote({
                  ...quote,
                  quote_hot: e.target.checked,
                })
              }
            />
          </label>
        </div>
        <div className="form-group">
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            Team
            <input
              type="checkbox"
              id="creditApplication"
              checked={quote.quote_team}
              onChange={(e) =>
                setQuote({
                  ...quote,
                  quote_team: e.target.checked,
                })
              }
            />
          </label>
        </div>
        <div className="form-group">
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            Air Ride
            <input
              type="checkbox"
              id="creditApplication"
              checked={quote.quote_air_ride}
              onChange={(e) =>
                setQuote({
                  ...quote,
                  quote_air_ride: e.target.checked,
                })
              }
            />
          </label>
        </div>
        <div className="form-group">
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            TARP
            <input
              type="checkbox"
              id="creditApplication"
              checked={quote.quote_tarp}
              onChange={(e) =>
                setQuote({
                  ...quote,
                  quote_tarp: e.target.checked,
                })
              }
            />
          </label>
        </div>
        <div className="form-group">
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            Hazmat
            <input
              type="checkbox"
              id="creditApplication"
              checked={quote.quote_hazmat}
              onChange={(e) =>
                setQuote({
                  ...quote,
                  quote_hazmat: e.target.checked,
                })
              }
            />
          </label>
        </div>
      </div>
    </fieldset>
  );
}

export default QuoteGeneral;
