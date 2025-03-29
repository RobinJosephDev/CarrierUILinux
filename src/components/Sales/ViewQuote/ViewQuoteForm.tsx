import { useEffect, useState } from 'react';
import ViewQuoteGeneral from './ViewQuoteGeneral';
import ViewQuoteDelivery from './ViewQuoteDelivery';
import ViewQuotePickup from './ViewQuotePickup';
import { Quote } from '../../../types/QuoteTypes';

interface ViewQuoteFormProps {
  quote: Quote | null;
  onClose: () => void;
}

const ViewQuoteForm: React.FC<ViewQuoteFormProps> = ({ quote, onClose }) => {
  const [formQuote, setFormQuote] = useState<Quote>({
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

  useEffect(() => {
    if (quote) {
      setFormQuote({
        ...quote,
        quote_pickup: Array.isArray(quote.quote_pickup) ? quote.quote_pickup : JSON.parse((quote.quote_pickup as any) || '[]'),
        quote_delivery: Array.isArray(quote.quote_delivery)
          ? quote.quote_delivery
          : JSON.parse((quote.quote_delivery as any) || '[]'),
      });
    }
  }, [quote]);

  return (
    <div className="form-container">
      <form className="form-main">
        <ViewQuoteGeneral formQuote={formQuote} />
        <fieldset className="form-section">
          <legend>Pickup</legend>
          <hr />
          <div className="form-row">
            {formQuote.quote_pickup.map((pickup, index) => (
              <ViewQuotePickup key={index} pickup={pickup} index={index} />
            ))}
          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Delivery</legend>
          <hr />
          <div className="form-row">
            {formQuote.quote_delivery.map((delivery, index) => (
              <ViewQuoteDelivery key={index} delivery={delivery} index={index} />
            ))}
          </div>
        </fieldset>      
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose} style={{ padding: '9px 15px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewQuoteForm;
