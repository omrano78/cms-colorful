import React from "react";
import { useState } from "react";
const AccordionPanel = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`card `}>
      <div className={`card-header ${isOpen ? "active" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <h5 className={`faq-title`}>
          <span className="badge">
            <i className={`fa ${isOpen ? " fa-angle-down " : "fa-angle-right"}`} aria-hidden="true"></i>
          </span>{" "}
          {props.title}
        </h5>
      </div>

      <div className={`${!isOpen && "collapse"}`}>
        <div className="card-body" dangerouslySetInnerHTML={{ __html: props.body }} />
      </div>
    </div>
  );
};

export default AccordionPanel;
