import { useState, useEffect } from "react";

function useSessionStorage(key, initialValue) {
  // Get the initial value from session storage or use the provided initial value
  const getInitialValue = () => {
    const storedValue = sessionStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  };

  const [value, setValue] = useState(getInitialValue);

  useEffect(() => {
    // Update session storage whenever the value changes
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default useSessionStorage;
