import '../../../styles/Form.css';
import { useAddShipment } from '../../../hooks/add/useAddShipment';
import ShipmentDetails from './ShipmentDetails';

interface AddShipmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddShipmentForm: React.FC<AddShipmentFormProps> = ({ onClose, onSuccess }) => {
  const { shipment, setShipment, handleSubmit } = useAddShipment(onClose, onSuccess);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-main">
        <div className="submit-button-container">
          <ShipmentDetails shipment={shipment} setShipment={setShipment} />
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Create Shipment
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

export default AddShipmentForm;
