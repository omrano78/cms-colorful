import Axios from "axios";
import React, { createContext, useEffect, useState } from "react";
const JanusContext = createContext();
export const JanusProvider = ({ children }) => {
  const getCurrentBrowser = () => {
    if (navigator.userAgent.indexOf("Edge") > -1 && navigator.appVersion.indexOf("Edge") > -1) {
      return "Edge";
    } else if (navigator.userAgent.indexOf("Opera") != -1 || navigator.userAgent.indexOf("OPR") != -1) {
      return "Opera";
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
      return "Chrome";
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return "Safari";
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return "Firefox";
    } else if (navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true) {
      //IF IE > 10
      return "IE";
    } else {
      return "unknown";
    }
  };
  const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)
    ) {
      return "mobile";
    }
    return "desktop";
  };

  const collectUserData = async () => {
    let data,
      error = null;

    try {
      const res = await Axios.get("https://geolocation-db.com/json/");
      data = {
        country: res.data.country_name,
        city: res.data.city,
      };
    } catch (e) {
      error = e;
    }

    if (data != null) {
      return data;
    } else {
      return {
        country: "",
        city: "",
      };
    }
  };

  async function fetchData() {
    let userData = await collectUserData();
    let janus = {
      country: userData.country,
      city: userData.city,
      device: getDeviceType().toLowerCase(),
      browser: getCurrentBrowser().toLowerCase(),
      visits: 1,
    };

    localStorage.setItem("janus", JSON.stringify(janus));
  }

  useEffect(() => {
    let janusContent = localStorage.getItem("janus");

    if (janusContent == null) {
      fetchData();
    }

    return () => {};
  }, []);

  const addVisit = () => {
    let janusContent = localStorage.getItem("janus");
    if (janusContent != null) {
      let janus = JSON.parse(janusContent);
      janus.visits = janus.visits + 1;
      localStorage.setItem("janus", JSON.stringify(janus));
    } else {
      fetchData();
    }
  };

  return <JanusContext.Provider value={{ addVisit, fetchData }}>{children}</JanusContext.Provider>;
};

export default JanusContext;
