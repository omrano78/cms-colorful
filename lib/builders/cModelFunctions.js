import { fetchGraphQL } from "../api";
import { getMarkupPlaceholders, getSecondPart, getFirstPart, getThirdPart } from "../../system/functions";
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import RichTextAsset from '../../components/rich-text-asset'

//graphData
export const getGraphData = async (query, param = null) => {
  var data = {};
  let index = 0;

  if (param) {
    if (Array.isArray(param))
      for (let item of param) {
        query = query.replace("{param" + index + "}", item);
        index++;
      }
    else {
      query = query.replace("{param0}", param);
      query = query.replace("{param1}", param);

    }
  }
  await fetchGraphQL(query).then(x => data = x);
  var fieldQuery = query.match(/\{([^{]+)\{/);
  //process query to get model name 
  if (fieldQuery) {
    var fieldName = fieldQuery[1].replace("  ", "").replace("\n", "").replace(" ", "").replace("(where:", "");
    if (data.data[fieldName]?.items && data.data[fieldName]?.items.length > 1)
      return data.data[fieldName]?.items;
    return data.data[fieldName]?.items[0];
  }
  return "";
};
const entryBlockMap = new Map();

function richTextRenderOptions(links) {
  // create an asset block map
  const assetBlockMap = new Map();
  // loop through the assets and add them to the map
  for (const asset of links.assets.block) {
    assetBlockMap.set(asset.sys.id, asset);
  }

  // create an entry block map
  const entryBlockMap = new Map();
  // loop through the entries and add them to the map
  for (const entry of links.entries.block) {
    entryBlockMap.set(entry.sys.id, entry);
  }
  // create an entry block map
  const entryInlineMap = new Map();
  // loop through the entries and add them to the map
  for (const entry of links.entries.inline) {
    entryInlineMap.set(entry.sys.id, entry);
  }

  return {
    renderNode: {
      [INLINES.EMBEDDED_ENTRY]: (node, children) => {
        const entry = entryInlineMap.get(node.data.target.sys.id);
        // target the contentType of the EMBEDDED_ENTRY to display as you need
        //To Do: Implement fetch rich text text content without depending on main graph query.
        return ((entry.label ? entry.label : "") + (entry.content ? documentToHtmlString(entry.content.json, richTextRenderOptions(entry.content.links)) : ""));
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
        // target the contentType of the EMBEDDED_ENTRY to display as you need
        const entry = entryBlockMap.get(node.data.target.sys.id);


        if (entry.__typename === "videoEmbed") {
          return (
            <iframe
              src={entry.embedUrl}
              height="100%"
              width="100%"
              frameBorder="0"
              scrolling="no"
              title={node.data.target.fields.title}
              allowFullScreen={true}
            />
          );
        }
        else {
          return ((entry.label ? entry.label : "") + (entry.content ? documentToHtmlString(entry.content.json, richTextRenderOptions(entry.content.links)) : ""));
        }
      },

      [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
        // render the EMBEDDED_ASSET as you need
        const entry = assetBlockMap.get(node.data.target.sys.id);
        var url = entry.url
        return `<img
            src="${url}"
            height="${entry.height}"
            width="${entry.width}"
            title ="${entry.title}"
          />`
          ;
      },
    },
  };
}


//render list Markup
export const renderListMarkup = (graphList, markup) => {
  let placeholders = getMarkupPlaceholders(markup);
  let fullHTML = "";
  if (graphList) {
    graphList.map((single) => {
      let singleMarkup = markup;

      placeholders.map((placeholder) => {
        let placeholderName = single[placeholder];
        let placeholderType = getSecondPart(placeholder);
        if (placeholderType == "img") {
          placeholderName = single[getFirstPart(placeholder)].url;
        }
        if (placeholderType && placeholderType.includes("reference")) {
          var referenceType = getFirstPart(placeholder);
          var fieldToQuery = getThirdPart(placeholder);
          var value = "";
          if (graphData[referenceType])
            value = single[referenceType][fieldToQuery];
          placeholderName = value;
        }
        if (placeholderType == "html") {
          placeholderName = escape(single[placeholder]);
        }
        if (placeholderType == "cards") {
          if (single[placeholder].length > 0) {
            placeholderName = `<div class='benifit-cards row'>
          <div class="col-md-12 mb-3"><h3>Benefits</h3></div>
          `;
            single[placeholder].map((listItem) => {
              placeholderName += `
            <div class="col-md-4">
            <div class="benifit-card my-3">
            <h6>${listItem.title}</h6>
            <p>${listItem.summary}</p>
            </div>
            </div>`;
            });
            placeholderName += `</div>`;
          } else {
            placeholderName = ``;
          }
        }
        if (placeholderType == "json") {
          placeholderName = escape(JSON.stringify(single[placeholder]));
        }
        if (placeholderType == "date") {
          const date = new Date(single[getFirstPart(placeholder)]);
          placeholderName = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
        }
        if (placeholderType == "list") {
          placeholderName = "<ul>";
          single[placeholder].map((listItem) => {
            placeholderName += `<li> ${listItem.item} </li>`;
          });
          placeholderName += `</ul>`;
        }
        if (placeholderType == "footerlist") {
          placeholderName = "<ul class='footer-nav'>";
          single[placeholder].map((listItem) => {
            placeholderName += `<li><HyperLink href="${listItem.url}" innertext='<i class="fa fa-angle-right"></i><span>${listItem.title}</span>'></HyperLink></li>`;
          });
          placeholderName += `</ul>`;
        }
        singleMarkup = singleMarkup.replace(`{${placeholder}}`, placeholderName);
      });
      fullHTML += singleMarkup;
    });
  }
  return fullHTML;
};
// render elemnt markup using graphData
export const renderSingleMarkup = (graphData, markup) => {
  let placeholders = getMarkupPlaceholders(markup);
  placeholders.map((placeholder) => {
    let placeholderName = placeholder;
    let placeholderType = getSecondPart(placeholder);
    if (placeholderType == "img")
      markup = markup.replace(`{${placeholder}}`, graphData[getFirstPart(placeholderName)].url);
    else if (placeholderType == "content") {
      markup = markup.replace(`{${placeholder}}`, documentToHtmlString(graphData[getFirstPart(placeholderName)].json, richTextRenderOptions(graphData[getFirstPart(placeholderName)].links)));

    }
    else if (placeholderType == "date") {
      const date = new Date(graphData[getFirstPart(placeholder)]);
      placeholderName = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
      markup = markup.replace(`{${placeholder}}`, placeholderName);
    }
    else if (placeholderType && placeholderType.includes("reference")) {
      var referenceType = getFirstPart(placeholder);
      var fieldToQuery = getThirdPart(placeholder);
      var value = "";
      if (graphData[referenceType])
        value = graphData[referenceType][fieldToQuery];
      markup = markup.replace(`{${placeholder}}`, value);
    }
    else
      markup = markup.replace(`{${placeholder}}`, graphData[placeholderName]);
  });
  return markup;
};

//render single Markup
export const renderWrapperMarkup = (graphData, markup) => {
  let placeholders = getMarkupPlaceholders(markup);
  placeholders.map((placeholder) => {
    markup = markup.replace(`{${placeholder}}`, graphData[placeholder]);
  });

  return markup;
};
