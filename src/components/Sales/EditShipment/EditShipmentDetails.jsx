function EditShipmentDetails({ formShipment, setFormShipment }) {
  return (
    <fieldset className="form-section">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="shipLoadDate">Load Date</label>
          <input
            type="date"
            value={formShipment.ship_load_date}
            onChange={(e) => setFormShipment({ ...formShipment, ship_load_date: e.target.value })}
            id="shipLoadDate"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipPickupLocation">Pickup Location</label>
          <input
            type="text"
            value={formShipment.ship_pickup_location}
            onChange={(e) =>
              setFormShipment({
                ...formShipment,
                ship_pickup_location: e.target.value,
              })
            }
            id="shipPickupLocation"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipDeliveryLocation">Delivery Location</label>
          <input
            type="text"
            value={formShipment.ship_delivery_location}
            onChange={(e) =>
              setFormShipment({
                ...formShipment,
                ship_delivery_location: e.target.value,
              })
            }
            id="shipDeliveryLocation"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipDriver">Driver</label>
          <input
            type="text"
            value={formShipment.ship_driver}
            onChange={(e) => setFormShipment({ ...formShipment, ship_driver: e.target.value })}
            id="shipDriver"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipWeight">Weight</label>
          <input
            type="number"
            value={formShipment.ship_weight}
            onChange={(e) => setFormShipment({ ...formShipment, ship_weight: e.target.value })}
            id="shipWeight"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipFtlLtl">FTL/LTL</label>
          <select
            value={formShipment.ship_ftl_ltl}
            onChange={(e) => setFormShipment({ ...formShipment, ship_ftl_ltl: e.target.value })}
            id="shipFtlLtl"
          >
            <option value="">Select</option>
            <option value="FTL">Full Truckload (FTL)</option>
            <option value="LTL">Less Than Truckload (LTL)</option>
          </select>
        </div>
        <div className="form-group">
          <label
            htmlFor="shipTarp"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            Tarp
            <input
              type="checkbox"
              checked={formShipment.ship_tarp}
              onChange={(e) =>
                setFormShipment({
                  ...formShipment,
                  ship_tarp: e.target.checked,
                })
              }
              id="shipTarp"
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="shipEquipment">Equipment</label>
          <input
            type="text"
            value={formShipment.ship_equipment}
            onChange={(e) => setFormShipment({ ...formShipment, ship_equipment: e.target.value })}
            id="shipEquipment"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipPrice">Price</label>
          <input
            type="number"
            value={formShipment.ship_price}
            onChange={(e) => setFormShipment({ ...formShipment, ship_price: e.target.value })}
            id="shipPrice"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipNotes">Notes</label>
          <textarea
            value={formShipment.ship_notes}
            onChange={(e) => setFormShipment({ ...formShipment, ship_notes: e.target.value })}
            id="shipNotes"
          ></textarea>
        </div>
      </div>
    </fieldset>
  );
}

export default EditShipmentDetails;
