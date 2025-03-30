import { FC } from "react";
import { Shipment } from "../../../types/ShipmentTypes";

interface ViewShipmentDetailsProps {
  formShipment: Shipment;
}

const ViewShipmentDetails: FC<ViewShipmentDetailsProps> = ({ formShipment }) => {
  return (
    <fieldset>
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
      <div className="form-group" style={{ flex: 1 }}>
          <label>Load type</label>
          <span>{formShipment?.ship_ftl_ltl || "N/A"}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Load Date</label>
          <span>{formShipment?.ship_load_date || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Pickup Location</label>
          <span>{formShipment?.ship_pickup_location || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Delivery Location</label>
          <span>{formShipment?.ship_delivery_location || "N/A"}</span>
        </div>
      </div>
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Driver</label>
          <span>{formShipment?.ship_driver || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Weight</label>
          <span>{formShipment?.ship_weight || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Equipment</label>
          <span>{formShipment?.ship_equipment || "N/A"}</span>
        </div>
      </div>
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Price</label>
          <span>{formShipment?.ship_price || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Notes</label>
          <span>{formShipment?.ship_notes || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="TARP" style={{ display: 'block' }}>
            TARP
          </label>
          <span>{formShipment.ship_tarp ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewShipmentDetails;
