const POST_GRAPHQL_FIELDS = `
slug
title
isFeatured
author {
  name
  picture {
    url
  }
}
coverImage {
  url
}
date
content {
  json
  links {
    assets {
      block {
        sys {
          id
        }
        url
        description
      }
    }
  }
}
`
const PAGE_OBJECT_GRAHQL_FIELDS=`
  code
  html 
  graphQl
  label
  head 
  defaultTheme{
    sys{
      id
    }
  }
`;

const CONTENT_OBJECT_GRAHQL_FIELDS=`
graphQl
isList
bodyTemplate
wrapperGraphQl
wrapperHeader
wrapperFooter
css
`;
const THEME_OBJECT_GRAHQL_FIELDS=`
label
code
html
css
sass
`;
//fetch query from contentful api
export async function fetchGraphQL(query, preview = false) {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          preview
            ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json())
}

function extractArticle(fetchResponse) {
  return fetchResponse?.data?.articleCollection?.items?.[0]
}

function extractArticleEntries(fetchResponse) {
  return fetchResponse?.data?.articleCollection?.items
}
function extractPageObject(fetchResponse) {
  return fetchResponse?.data?.pageObjectCollection?.items?.[0]
}
function extractContentContainerObject(fetchResponse) {
  return fetchResponse?.data?.contentContainerObjectCollection?.items?.[0]
}
function extractThemeObject(fetchResponse) {
  return fetchResponse?.data?.themeTemplate;
}
export async function getPreviewArticleBySlug(slug) {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    true
  )
  return extractArticle(entry)
}

export async function getAllArticlesWithSlug() {
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_exists: true }, order: date_DESC) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`
  )
  return extractArticleEntries(entries)
}

export async function getAllArticlesForHome(preview) {
  const entries = await fetchGraphQL(
    `query {
      postCollection(order: date_DESC, preview: ${preview ? 'true' : 'false'}) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return extractArticleEntries(entries)
}

export async function getArticleAndMoreArticles(slug, preview) {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: ${
      preview ? 'true' : 'false'
    }, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_not_in: "${slug}" }, order: date_DESC, preview: ${
      preview ? 'true' : 'false'
    }, limit: 2) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return {
    article: extractArticle(entry),
    moreArticles: extractArticleEntries(entries),
  }
}
export async function getPageObjectById(id){
  const entry = await fetchGraphQL(
    `query {
      pageObjectCollection(where:{code:"${id}"} preview: 
      false
    , limit: 1) {
        items {
          ${PAGE_OBJECT_GRAHQL_FIELDS}
        }
      }
    }`,
    false
  );
  return extractPageObject(entry);
  return entry;

};
// get content object by code
export async function getContentObjectById(id,preview){
  const entry = await fetchGraphQL(
    `query {
      contentContainerObjectCollection(where: { code: "${id}" }, preview: false
    , limit: 1) {
        items {
          ${CONTENT_OBJECT_GRAHQL_FIELDS}
        }
      }
    }`,
    false
  );
  return extractContentContainerObject(entry);
  // return entry;
 };
 // get theme object by code
 export async function getThemeObjectById(id){
  const entry = await fetchGraphQL(
    `query {
      themeTemplate(id:"${id}") {
          ${THEME_OBJECT_GRAHQL_FIELDS}
      }
    }`
  );
  return extractThemeObject(entry);
  // return entry;
 };
