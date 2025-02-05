import '../../styles/Form.css';
import AutocompleteAddressInput from "./AutocompleteAddressInput"; 

const Form = ({ formData, onChange, options }) => {
  const handleChange = (key, value) => {
    onChange({ ...formData, [key]: value });
  };

  const handleSelectChange = (key, value) => {
    onChange({ ...formData, [key]: value });
  };

  const formatLabel = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const inputType = (key) => {
    switch (key) {
      case 'email':
        return 'email';
      case 'phone':
        return 'tel';
      case 'website':
        return 'url';
      case 'lead_date':
      case 'follow_up_date':
        return 'date';
      default:
        return 'text';
    }
  };

  const isTextarea = (key) => ['notes'].includes(key);
  const isRequired = (key) => ['customer_name', 'phone', 'email'].includes(key);

  const renderField = (key) => {
    const fieldType = isTextarea(key) ? 'textarea' : 'input';
    const value = formData[key] || '';

    return fieldType === 'textarea' ? (
      <textarea
        id={key}
        className="textarea"
        value={value}
        onChange={(e) => handleChange(key, e.target.value)}
        placeholder={`Enter ${formatLabel(key)}`}
        required={isRequired(key)}
      />
    ) : (
      <input
        type={inputType(key)}
        id={key}
        className="input"
        value={value}
        onChange={(e) => handleChange(key, e.target.value)}
        placeholder={`Enter ${formatLabel(key)}`}
        required={isRequired(key)}
      />
    );
  };

  const renderAddressField = () => (
    <AutocompleteAddressInput
      streetValue={formData.address || ''}
      onStreetChange={(value) => handleChange('address', value)}
      onCityChange={(value) => handleChange('city', value)}
      onStateChange={(value) => handleChange('state', value)}
      onCountryChange={(value) => handleChange('country', value)}
      onPostalCodeChange={(value) => handleChange('postalCode', value)}
    />
  );

  return (
    <div className="form-container">
      <div className="form-element">
        {Object.keys(formData)
          .filter(key => key !== 'id') // Exclude 'id' from the rendered fields
          .map((key) => (
            <div className="form-group" key={key}>
              <label className="label" htmlFor={key}>{formatLabel(key)}</label>
              {['lead_type', 'lead_status', 'equipment_type'].includes(key) ? (
                <select
                  id={key}
                  className="select"
                  value={formData[key] || ''}
                  onChange={(e) => handleSelectChange(key, e.target.value)}
                  required={isRequired(key)}
                >
                  {options[key].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : key === 'address' ? (
                renderAddressField()
              ) : (
                renderField(key)
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Form;
