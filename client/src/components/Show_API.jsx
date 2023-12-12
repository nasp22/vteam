import React, { useEffect, useState } from "react";
import { fetchData } from "../utils/GET_request";
import Loading from "./Loading";

const Show_stations = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Skapa fetch med önskad endpoint, tex, station, user osv....
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
          {/* Nu kan vi använda data.map eller bara data som variabel */}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <Loading/>
      )}
    </div>
  );
};

export default Show_stations;
