function ViewShipmentDetails({ formShipment }) {
  return (
    <fieldset className="form-section">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="shipLoadDate">Load Date</label>
          <div>{formShipment.ship_load_date || 'N/A'}</div> {/* Display load date */}
        </div>
        <div className="form-group">
          <label htmlFor="shipPickupLocation">Pickup Location</label>
          <div>{formShipment.ship_pickup_location || 'N/A'}</div> {/* Display pickup location */}
        </div>
        <div className="form-group">
          <label htmlFor="shipDeliveryLocation">Delivery Location</label>
          <div>{formShipment.ship_delivery_location || 'N/A'}</div> {/* Display delivery location */}
        </div>
        <div className="form-group">
          <label htmlFor="shipDriver">Driver</label>
          <div>{formShipment.ship_driver || 'N/A'}</div> {/* Display driver */}
        </div>
        <div className="form-group">
          <label htmlFor="shipWeight">Weight</label>
          <div>{formShipment.ship_weight || 'N/A'}</div> {/* Display weight */}
        </div>
        <div className="form-group">
          <label htmlFor="shipFtlLtl">FTL/LTL</label>
          <div>{formShipment.ship_ftl_ltl || 'N/A'}</div> {/* Display FTL/LTL */}
        </div>
        <div className="form-group">
          <label htmlFor="shipTarp">Tarp</label>
          <div>{formShipment.ship_tarp ? 'Yes' : 'No'}</div> {/* Display Tarp */}
        </div>
        <div className="form-group">
          <label htmlFor="shipEquipment">Equipment</label>
          <div>{formShipment.ship_equipment || 'N/A'}</div> {/* Display equipment */}
        </div>
        <div className="form-group">
          <label htmlFor="shipPrice">Price</label>
          <div>{formShipment.ship_price || 'N/A'}</div> {/* Display price */}
        </div>
        <div className="form-group">
          <label htmlFor="shipNotes">Notes</label>
          <div>{formShipment.ship_notes || 'N/A'}</div> {/* Display notes */}
        </div>
      </div>
    </fieldset>
  );
}

export default ViewShipmentDetails;
