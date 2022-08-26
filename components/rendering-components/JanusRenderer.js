import React, { useContext, useEffect, useState } from "react";
import JanusContext from "../../system/contexts/JanusContext";

const JanusRenderer = ({ browser, country, city, visits, device, casetrue, casefalse }) => {
  const [loading, setloading] = useState(true);
  const [data, setData] = useState("");

  const { addVisit, fetchData } = useContext(JanusContext);

  const loadCorrectContentObject = (userData) => {
    if (
      country == userData.country ||
      browser == userData.browser ||
      city == userData.country ||
      visits == userData.visits ||
      device == userData.device
    ) {
      setData(casetrue);
    } else {
      if (casefalse != null) {
        setData(casefalse);
      }
    }
    setloading(false);
  };
  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("janus"));
    if (userData != null) {
      loadCorrectContentObject(userData);
    } else {
      fetchData().then((response) => {
        userData = JSON.parse(localStorage.getItem("janus"));
        loadCorrectContentObject(userData);
      });
    }
  }, []);
  return (
    <div>
      {loading ? <h1 className="text-center">Loading</h1> : <div className="real-janus-data"></div>}
      <div className="janus-render" dangerouslySetInnerHTML={{ __html: `${unescape(data)}` }}></div>
    </div>
  );
};
export default JanusRenderer;
