import { useContext, useEffect, useState } from "react";
import { renderPage } from "../lib/builders/contentModelBuilders";
import { useRouter } from "next/router";
import JanusContext from "../system/contexts/JanusContext";
import ReactHtmlParser from "react-html-parser";
import { tagsTransformer } from "../system/functions";
import { isArray } from "@apollo/client/cache/inmemory/helpers";

const Home = ({ pageContent,theme }) => {

  const router = useRouter();

  /// on browser
 useEffect(()=>{
  if(theme) {
    document.head.insertAdjacentHTML('beforeend',theme.html);
  } 
  if(!pageContent)router.push("/")
 })

  
  return (
    <div>
      {
        <div>
           {ReactHtmlParser(pageContent, { transform: tagsTransformer })}
        </div>
     }
    </div>
  );
};

export default Home;

//Rendering on server vercel
export async function getServerSideProps(context) {

  var path = context.query?.path;
  let pageObjectId = "home-page";

  if(path && Array.isArray(path)){
    pageObjectId = path[0];
    path = path.slice(1,path.length);
  }

  var pageContent=await renderPage(pageObjectId,path);
  return {
    props: {
      pageContent: pageContent?.content,
      theme:pageContent?.theme
    },
  };
}
