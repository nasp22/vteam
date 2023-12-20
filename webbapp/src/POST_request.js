const BASE_URL = "http://localhost:1337";

export const postData = async (endpoint, data = {}) => {
  const url = `${BASE_URL}/${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Något gick fel. Statuskod: ${response.status}`);
      }
      const result = await response.json();
    return result;

  } catch (error) {
    console.error('Fel vid POST-förfrågan:', error.message);
    throw error;
  }
};
