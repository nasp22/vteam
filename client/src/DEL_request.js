const BASE_URL = "http://localhost:1337";

export const delData = async (endpoint, _id) => {
  const url = `${BASE_URL}/${endpoint}/${_id}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Något gick fel. Statuskod: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Fel vid DELETE-förfrågan:', error.message);
    throw error;
  }
};
