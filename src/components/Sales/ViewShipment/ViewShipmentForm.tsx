import useEditShipment from '../../../hooks/edit/useEditShipment';
import { Shipment } from '../../../types/ShipmentTypes';
import ViewShipmentDetails from './ViewShipmentDetails';

interface EditShipmentFormProps {
  shipment: Shipment | null;
  onClose: () => void;
}

const ViewShipmentForm: React.FC<EditShipmentFormProps> = ({ shipment, onClose }) => {
  const { formShipment, setFormShipment } = useEditShipment(shipment, onClose);

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="form-main"
      >
        <ViewShipmentDetails formShipment={formShipment} />
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose} style={{ padding: '9px 15px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewShipmentForm;
