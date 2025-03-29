import { Shipment } from '../../../types/ShipmentTypes';
import useEditShipment from '../../../hooks/edit/useEditShipment';
import EditShipmentDetails from './EditShipmentDetails';

interface EditShipmentFormProps {
  shipment: Shipment | null;
  onClose: () => void;
  onUpdate: (shipment: Shipment) => void;
}

const EditShipmentForm: React.FC<EditShipmentFormProps> = ({ shipment, onClose, onUpdate }) => {
  const { formShipment, setFormShipment, updateShipment } = useEditShipment(shipment, onClose, onUpdate);

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateShipment();
        }}
        className="form-main"
      >
        {formShipment && (
          <>
            <EditShipmentDetails formShipment={formShipment} setFormShipment={setFormShipment} />
          </>
        )}
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Save
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditShipmentForm;
