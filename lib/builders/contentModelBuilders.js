import { getMarkupPlaceholders } from "../../system/functions";
import { getContentObjectById, getPageObjectById, getThemeObjectById } from "../api";
import { getGraphData, renderListMarkup, renderWrapperMarkup, renderSingleMarkup } from "./cModelFunctions";
// render page method get page code and returns the html page
export const renderPage = async (pageObjectId, param) => {
  var data = {};
  await getPageObjectById(pageObjectId).then(x => data = x);
  var theme = {};
  if (data != null && data.defaultTheme && data.defaultTheme.sys)
    await getThemeObjectById(data.defaultTheme.sys.id).then(x => theme = x);
  if (data) {
    let htmlDataContent = data.html;
    let components = getMarkupPlaceholders(htmlDataContent);


    const getData = async () => {
      return Promise.all(components.map((item) => getContentObjectMarkup(item, param)));
    };

    let markupList = await getData();

    markupList.forEach((item) => {
      htmlDataContent = htmlDataContent.replace(`{${item.code}}`, item.markup);
    });

    return { content: htmlDataContent, theme: theme };
  }
  return { content: "", theme: "" };


};
// get markup for content object
// input: content object code
export const getContentObjectMarkup = async (contentObjectId, param) => {

  var data = {};
  await getContentObjectById(contentObjectId).then(x => data = x);
  if (data != null) {
    let wrapperHeader = data.wrapperHeader;
    let wrapperFooter = data.wrapperFooter;
    let wrapperGraphql = data.wrapperGraphQl;
    let htmlSingleContent = data.bodyTemplate;
    let componentCSS = data.css != null ? `<style>${data.css}</style>` : "";

    let htmlContent = "";
    let graphQl = data.graphQl;

    let dataList = [];
    graphQl != null && (await getGraphData(graphQl, param).then(x => dataList = x));
    let wrapperData = [];
    wrapperGraphql != null && (await getGraphData(wrapperGraphql,param).then(x => wrapperData = x));
    let isList = data.isList;
    if (isList && Array.isArray(dataList) && dataList) {
      htmlContent = renderListMarkup(dataList, htmlSingleContent);
    } else if(dataList) {
      htmlContent = renderSingleMarkup(dataList, htmlSingleContent);
    }

    let fullMarkup = renderWrapperMarkup(wrapperData, (wrapperHeader ? wrapperHeader : "") + (htmlContent ? htmlContent : "") + (wrapperFooter ? wrapperFooter : ""));

    return {
      code: contentObjectId,
      markup: fullMarkup + componentCSS,
    };
  }
  return {
    code: contentObjectId,
    markup: "",
  };
};
