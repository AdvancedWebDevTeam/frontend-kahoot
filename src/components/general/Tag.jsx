import React from "react";
import "./generalComponent.css";

function Tag(props) {
  const { children, variant } = props;

  return <div className={`tag ${variant}`}>{children}</div>;
}

export default Tag;
