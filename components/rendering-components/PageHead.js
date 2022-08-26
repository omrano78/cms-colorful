import React from "react";
import Head from "next/head";

const PageHead = ({ title, innerData }) => {
  return (
    <Head>
      <title>{title != null ? title : "Core Models"}</title>
      {innerData != null && innerData}
    </Head>
  );
};

export default PageHead;
