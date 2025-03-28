import '../../../styles/Form.css';
import QuoteGeneral from './QuoteGeneral';
import QuotePickup from './QuotePickup';
import QuoteDelivery from './QuoteDelivery';
import { PlusOutlined } from '@ant-design/icons';
import { useAddQuote } from '../../../hooks/add/useAddQuote';

interface AddQuoteFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddQuoteForm: React.FC<AddQuoteFormProps> = ({ onClose, onSuccess }) => {
  const {
    quote,
    setQuote,
    handleSubmit,
    handleAddPickup,
    handlePickupChange,
    handleRemovePickup,
    handleAddDelivery,
    handleDeliveryChange,
    handleRemoveDelivery,
  } = useAddQuote(onClose, onSuccess);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-main">
        <div className="submit-button-container">
          <QuoteGeneral quote={quote} setQuote={setQuote} />
          <fieldset className="form-section">
            <legend>Pickup</legend>
            <hr />
            <div className="form-row">
              {quote.quote_pickup.map((pickup, index) => (
                <QuotePickup
                  quote={quote}
                  setQuote={setQuote}
                  key={index}
                  quote_pickup={quote.quote_pickup}
                  index={index}
                  onAddPickup={handleAddPickup}
                  handlePickupChange={handlePickupChange}
                  handleRemovePickup={handleRemovePickup}
                />
              ))}
            </div>
            {quote.quote_pickup.length === 0 && (
              <button type="button" onClick={handleAddPickup} className="add-button">
                <PlusOutlined />
              </button>
            )}
          </fieldset>

          <fieldset className="form-section">
            <legend>Delivery</legend>
            <hr />
            <div className="form-row">
              {quote.quote_delivery.map((delivery, index) => (
                <QuoteDelivery
                  quote={quote}
                  setQuote={setQuote}
                  key={index}
                  quote_delivery={quote.quote_delivery}
                  index={index}
                  onAddDelivery={handleAddDelivery}
                  handleDeliveryChange={handleDeliveryChange}
                  handleRemoveDelivery={handleRemoveDelivery}
                />
              ))}
            </div>
            {quote.quote_delivery.length === 0 && (
              <button type="button" onClick={handleAddDelivery} className="add-button">
                <PlusOutlined />
              </button>
            )}
          </fieldset>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Create Quote
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddQuoteForm;
