import { useState, useEffect } from 'react';
function ViewQuoteGeneral({ formQuote }) {
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
    if (formQuote.quote_customer) {
      const selectedCustomer = customers.find((c) => c.value === formQuote.quote_customer);
      setCustomerRefNos(selectedCustomer ? [{ value: selectedCustomer.refNo, label: selectedCustomer.refNo }] : []);
    } else {
      setCustomerRefNos([]);
    }
  }, [formQuote.quote_customer, customers]);

  return (
    <fieldset className="form-section">
      <legend>General</legend>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quoteType">Quote Type</label>
          <div>{formQuote.quote_type || 'N/A'}</div> {/* Display quote type */}
        </div>
        <div className="form-group">
          <label htmlFor="quote_customer">Customer</label>
          <div>{formQuote.quote_customer || 'N/A'}</div> {/* Display selected customer */}
        </div>
        <div className="form-group">
          <label htmlFor="customerRefNo">Customer Ref. No</label>
          <div>{formQuote.quote_cust_ref_no || 'N/A'}</div> {/* Display reference number */}
        </div>
        <div className="form-group">
          <label htmlFor="accNo">Booked By</label>
          <div>{formQuote.quote_booked_by || 'N/A'}</div> {/* Display booked by */}
        </div>
        <div className="form-group">
          <label htmlFor="branch">Temperature</label>
          <div>{formQuote.quote_temperature || 'N/A'}</div> {/* Display temperature */}
        </div>

        <div className="form-group">
          <label style={{ display: 'inline-flex', alignItems: 'center', width: '100%' }}>
            Hot
            <div>{formQuote.quote_hot ? 'Yes' : 'No'}</div> {/* Display Hot status */}
          </label>
        </div>
        <div className="form-group">
          <label style={{ display: 'inline-flex', alignItems: 'center', width: '100%' }}>
            Team
            <div>{formQuote.quote_team ? 'Yes' : 'No'}</div> {/* Display Team status */}
          </label>
        </div>
        <div className="form-group">
          <label style={{ display: 'inline-flex', alignItems: 'center', width: '100%' }}>
            Air Ride
            <div>{formQuote.quote_air_ride ? 'Yes' : 'No'}</div> {/* Display Air Ride status */}
          </label>
        </div>
        <div className="form-group">
          <label style={{ display: 'inline-flex', alignItems: 'center', width: '100%' }}>
            TARP
            <div>{formQuote.quote_tarp ? 'Yes' : 'No'}</div> {/* Display TARP status */}
          </label>
        </div>
        <div className="form-group">
          <label style={{ display: 'inline-flex', alignItems: 'center', width: '100%' }}>
            Hazmat
            <div>{formQuote.quote_hazmat ? 'Yes' : 'No'}</div> {/* Display Hazmat status */}
          </label>
        </div>
      </div>
    </fieldset>
  );
}

export default ViewQuoteGeneral;
