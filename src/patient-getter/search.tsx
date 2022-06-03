import React, { useState } from "react";
import style from "./search.scss";
import PatientFormRegistry from "../components/patient-form/patient-registration/patient-registration-component";


export function PatientGetter() {
  const [patient, setPatient] = useState<fhir.Patient>();
  const patientName = "James";
  return (
    <div className={style.formatPage}>
      <div className={style.mainContainer}>
          <div className={style.self}>
            <PatientFormRegistry />
          </div>
      </div>
    </div>
  );
}


