function ViewQuotePickup({ pickup, index, onChange, onRemove }) {
  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Address</label>
        <div>{pickup.address || 'N/A'}</div> {/* Display address value */}
      </div>
      <div className="form-group">
        <label>City</label>
        <div>{pickup.city || 'N/A'}</div> {/* Display city value */}
      </div>
      <div className="form-group">
        <label>State</label>
        <div>{pickup.state || 'N/A'}</div> {/* Display state value */}
      </div>
      <div className="form-group">
        <label>Postal Code</label>
        <div>{pickup.postal || 'N/A'}</div> {/* Display postal code value */}
      </div>
      <div className="form-group">
        <label>Country</label>
        <div>{pickup.country || 'N/A'}</div> {/* Display country value */}
      </div>
    </div>
  );
}

export default ViewQuotePickup;
