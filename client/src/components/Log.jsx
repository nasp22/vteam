import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from 'react';
import { fetchData } from '../GET_request';
import SignedInUser from "./SignedInUser";
import '../style/Log.css';

const Log = () => {
  const { user } = useAuth0();
  const loggedInUser = SignedInUser();
  const [allLogs, setAllLogs] = useState([]);

  useEffect(() => {
    const fetchDataFromRent = async () => {
      const result = await fetchData('rent');
      setAllLogs(result.data);
    };
    fetchDataFromRent();
  }, [user]);

  const filteredLogs = allLogs.filter((log) => log.user.id === loggedInUser._id);

  for (let i = 0; i < filteredLogs.length; i++) {
    const startTime = new Date(filteredLogs[i].start_time);
    const endTime = new Date(filteredLogs[i].end_time);
    const timeDiffInMinutes = Math.floor((endTime - startTime) / (1000 * 60))
    const year = startTime.getFullYear();
    const month = (startTime.getMonth() + 1).toString().padStart(2, '0');
    const day = startTime.getDate().toString().padStart(2, '0');
    const time_start = startTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    const time_end = endTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    filteredLogs[i].start_time = `${year}-${month}-${day}-${time_start}-${time_end}-${timeDiffInMinutes}`;
  }

  return (
    <div>
      <table className="log-table">
        <thead>
          <tr className="log-tr">
            <th className="log-th">Datum</th>
            <th className="log-th">Starttid</th>
            <th className="log-th">Sluttid</th>
            <th className="log-th">Hyrtid (min)</th>
            <th className="log-th">Kostnad (kr)</th>
          </tr>
        </thead>
        <tbody>
        {filteredLogs.reverse().map((item, index) => (
  <tr key={index} className="log-th">
    {item.payed === false && item.end_time ? (
      <>
        <td className="log-td">{item.start_time.slice(0, 10)}</td>
        <td className="log-td">{item.start_time.slice(11, 16)}</td>
        <td className="log-td">--:--</td>
        <td className="log-td">0</td>
        <td className="log-td">Köp avbrutet</td>
      </>
    ) : !item.payed && item.start_time ? (
      <>
        <td className="log-td">{item.start_time.slice(0, 10)}</td>
        <td className="log-td">{item.start_time.slice(11, 16)}</td>
        <td className="log-td">--:--</td>
        <td className="log-td">Pågående</td>
        <td className="log-td">Pågående</td>
      </>
    ) : (
      <>
        <td className="log-td">{item.start_time.slice(0, 10)}</td>
        <td className="log-td">{item.start_time.slice(11, 16)}</td>
        <td className="log-td">{item.start_time.slice(17, 22)}</td>
        <td className="log-td">{item.start_time.slice(23)}</td>
        <td className="log-td">{item.cost}</td>
      </>
    )}
  </tr>
))}
        </tbody>
      </table>
    </div>
  );
};

export default Log;
