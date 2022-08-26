import React, { useState } from "react";

const LightBox = (props) => {
  const [images, setimages] = useState(JSON.parse(unescape(props.images)));
  return (
      <div className="lightbox-container">
        {images.map((img) => (
          <div className="single-lightbox">
            <a href={img.url}>
              <img src={img.url} />
            </a>
          </div>
        ))}
      </div>
    
  );
};
export default LightBox;
