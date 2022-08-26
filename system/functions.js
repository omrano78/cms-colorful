import qs from "qs";
import axios from "axios";
import config from "./config";
import Axios from "axios";
import react from "react";
import HyperLink from "../components/rendering-components/HyperLink";
import AccordionPanel from "../components/rendering-components/AccordionPanel";
import LightBox from "../components/rendering-components/LightBox";
import JanusRenderer from "../components/rendering-components/JanusRenderer";
import NavigationList from "../components/rendering-components/NavigationList";
import PageHead from "../components/rendering-components/PageHead";
import ContactForm from "../components/Contact/ContactForm";
import { ToastProvider, useToasts } from "react-toast-notifications";

export const getToken = () => {
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
  return axios.post(config.authorization.uri, qs.stringify(postData), axiosConfig);
};

export function getAuthorizationToken() {
  var token = "";
  getToken().then((response) => {
    token = response.data.token_type + " " + response.data.access_token;
  });

  return token;
}

export function generateMyToken() {
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
  return new Promise(function (resolve, reject) {
    axios.post(config.authorization.uri, qs.stringify(postData), axiosConfig).then(
      (response) => {
        var result = response.data;
        resolve(result);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export function getComent(cId = 20) {
  return new Promise(function (resolve, reject) {
    Axios.get(`https://jsonplaceholder.typicode.com/comments/${cId}`).then(
      (response) => {
        var result = response.data;
        resolve(result);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export function getMarkupPlaceholders(markup) {
  markup += '';
  if (markup != null) {
    let matches = markup
      .split("{")
      .filter(function (v) {
        return v.indexOf("}") > -1;
      })
      .map(function (value) {
        return value.split("}")[0];
      });

    return matches;
  } else {
    return [];
  }
}

export function getSecondPart(str) {
  return str.split("_")[1];
}
export function getThirdPart(str) {
  return str.split("_")[2];
}
export function getFirstPart(str) {
  return str.split("_")[0];
}
export function getMonthName(str) { }

export function tagsTransformer(node) {
  if (node.type === "tag" && node.name === "hyperlink") {
    return <HyperLink {...node.attribs} children={node.children} />;
  }

  if (node.type === "tag" && node.name === "accordionpanel") {
    return <AccordionPanel {...node.attribs} children={node.children} />;
  }

  if (node.type === "tag" && node.name === "contactform") {
    return <ToastProvider><ContactForm {...node.attribs} children={node.children} /></ToastProvider>;
  }
  if (node.type === "tag" && node.name === "author") {
    return (<>{node.children != null && node.children.length>0 && 
    <><strong>By:</strong> <a href="#">{node.children[0].data}</a></>
  }</>);
  }


  if (node.type === "tag" && node.name === "lightbox") {
    return <LightBox {...node.attribs} children={node.children} />;
  }

  if (node.type === "tag" && node.name === "janus") {
    return <JanusRenderer {...node.attribs} children={node.children} />;
  }

  if (node.type === "tag" && node.name === "navlist") {
    return <NavigationList {...node.attribs} children={node.children} />;
  }
  if (node.type === "tag" && node.name === "pagehead") {
    return <PageHead {...node.attribs} children={node.children} />;
  }
}
