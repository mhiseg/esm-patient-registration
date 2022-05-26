
import React from "react";
//import styles from "./hello.css";
import { PatientGetter } from "./patient-getter/search";

const Hello: React.FC = () => {
  return (
    <div className={`omrs-main-content `}>
      <PatientGetter /> 
    </div>
  );
};

export default Hello;


