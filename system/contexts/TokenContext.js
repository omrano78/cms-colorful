import React, { createContext, useState } from "react";
import qs from "qs";
import axios from "axios";
import config from "../config";
export const TokenContext = createContext();
const TokenProvider = ({ children }) => {
  const [token, settoken] = useState(null);

  const generateToken = () => {
    var postData = {
      scope: config.authorization.scope,
      client_secret: config.authorization.client_secret,
      client_id: config.authorization.client_id,
      grant_type: config.authorization.grant_type,
    };
    let axiosConfig = {
      headers: {
        "Content-Type": config.authorization.content_type,
      },
    };
    axios
      .post(config.authorization.uri, qs.stringify(postData), axiosConfig)
      .then((res) => {
        settoken(res.data.access_token);
        localStorage.setItem("beToken", res.data.access_token);
        return res.data.access_token;
      })
      .catch((err) => {});
  };

  const getToken = () => {
    let lsToken = localStorage.getItem("beToken");

    if (lsToken == null) {
      generateToken();
    } else {
      return lsToken;
    }
  };
  return <TokenContext.Provider value={{ getToken }}>{children}</TokenContext.Provider>;
};

export default TokenProvider;
