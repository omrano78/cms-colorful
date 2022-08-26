const appConfig = {
  gcms: {
    //uri: "https://gcms-docs.azurewebsites.net/api/content/docs/graphql",
    uri: "https://content.coremodels.io/api/content/coremodels/graphql",
  },
  authorization: {
    uri: "https://content.coremodels.io/identity-server/connect/token",
    scope: "GCMS-api",
    client_secret: "jwvtgf19trrohpbub4p3adg29fjfrivlkv5pswi3mpux",
    client_id: "5fa5958bcc848d1bfc324d46",
    grant_type: "client_credentials",
    content_type: "application/x-www-form-urlencoded",
  },
  header: {
    logo: "",
    logoLink: "/",
    title: "CORE MODELS Docs",
    links: [{ text: "", link: "" }],
    search: {
      enabled: true,
      indexName: "gcms",
      algoliaAppId: "HBGHUQI7PV",
      algoliaSearchKey: "8da9a3e3b27306f7c2b637a03e637fe8",
      algoliaAdminKey: "598a4f4a1cf0f07f488617852709ed83",
      buildIndex: false,
      numberOfBodyWords: 20,
    },
  },
  sidebar: {
    links: [
      { text: "CORE MODELS", link: "https://coremodels.io" },
      { text: "API Documentation", link: "https://apidocs.coremodels.io" },
    ],
    ignoreIndex: true,
  },

  tableOfContents: {
    headings: "h1",
  },
  breadcrumbs: {
    separator: "/",
  },
};

export default appConfig;
