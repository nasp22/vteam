import React, { useEffect, useState } from "react";
import { fetchData } from "../utils/GET_request";
import Loading from "./Loading";

const Show_stations = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Skapa fetch med önskad endpoin, tex, station, user osv....
    const fetchDataFromAPI = async () => {
    const result = await fetchData("station");
    setData(result);

    };

    fetchDataFromAPI();
  }, []);

  return (
    <div>
      {data ? (
        <div>
          {/* Visa data här */}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <Loading/>
      )}
    </div>
  );
};

export default Show_stations;
