function ViewQuoteDelivery({ delivery }) {
  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Address</label>
        <div>{delivery.address || 'N/A'}</div> {/* Display address */}
      </div>
      <div className="form-group">
        <label>City</label>
        <div>{delivery.city || 'N/A'}</div> {/* Display city */}
      </div>
      <div className="form-group">
        <label>State</label>
        <div>{delivery.state || 'N/A'}</div> {/* Display state */}
      </div>
      <div className="form-group">
        <label>Postal Code</label>
        <div>{delivery.postal || 'N/A'}</div> {/* Display postal code */}
      </div>
      <div className="form-group">
        <label>Country</label>
        <div>{delivery.country || 'N/A'}</div> {/* Display country */}
      </div>
      <div className="form-group">
        <label>Rate</label>
        <div>{delivery.rate || 'N/A'}</div> {/* Display rate */}
      </div>
      <div className="form-group">
        <label>Currency</label>
        <div>{delivery.currency || 'N/A'}</div> {/* Display currency */}
      </div>
      <div className="form-group">
        <label>Equipment</label>
        <div>{delivery.equipment || 'N/A'}</div> {/* Display equipment */}
      </div>
      <div className="form-group">
        <label>Notes</label>
        <div>{delivery.notes || 'N/A'}</div> {/* Display notes */}
      </div>
      <div className="form-group">
        <label>Packages</label>
        <div>{delivery.packages || 'N/A'}</div> {/* Display packages */}
      </div>
      <div className="form-group">
        <label>Dimensions</label>
        <div>{delivery.dimensions || 'N/A'}</div> {/* Display dimensions */}
      </div>
    </div>
  );
}

export default ViewQuoteDelivery;
