import Link from "next/link";
import React from "react";
const HyperLink = (props) => {
  return (
    <Link href={props.href}>
      <a className={props.cssclasses} dangerouslySetInnerHTML={{ __html: props.innertext }} />
    </Link>
  );
};
export default HyperLink;
