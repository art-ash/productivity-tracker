import React from "react";
import "./Preloader.scss";

const Preloader = () => {
  return (
    <div className="lds">
      <div className="lds-spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default Preloader;
