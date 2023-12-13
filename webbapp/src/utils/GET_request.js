const BASE_URL = "http://localhost:1337";

export const fetchData = async (endpoint, options = {}) => {
  const url = `${BASE_URL}/${endpoint}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Något gick fel");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
