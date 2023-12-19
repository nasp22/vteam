const BASE_URL = "http://localhost:1337";

export const postData = async (endpoint, options = {}) => {
  const url = `${BASE_URL}/${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: options
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Error");
    }

    return responseData;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
