import { useEffect, useRef } from "react";

const AutocompleteAddressInput = ({
  streetValue,
  onStreetChange,
  onCityChange,
  onStateChange,
  onCountryChange,
  onPostalCodeChange,
}) => {
  const addressRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsApi = () => {
      if (window.google && window.google.maps) {
        initializeAutocomplete();
        return;
      }
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places"; 
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          initializeAutocomplete();
        }
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsApi();
  }, []);

  const initializeAutocomplete = () => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      addressRef.current,
      {
        types: ["address"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const formattedAddress = place.formatted_address || "";

      // Update fields with place details
      onStreetChange(formattedAddress);
      onCityChange(getComponent("locality", "", place.address_components));
      onStateChange(
        getComponent(
          "administrative_area_level_1",
          "",
          place.address_components
        )
      );
      onCountryChange(getComponent("country", "", place.address_components));
      onPostalCodeChange(
        getComponent("postal_code", "", place.address_components)
      );
    });
  };

  const getComponent = (type, fallback, components) => {
    const component = components.find((c) => c.types.includes(type));
    return component ? component.long_name : fallback;
  };

  return (
    <input
      type="text"
      ref={addressRef}
      className="input"
      value={streetValue}
      onChange={(e) => onStreetChange(e.target.value)}
      placeholder="Enter your address"
    />
  );
};

export default AutocompleteAddressInput;
