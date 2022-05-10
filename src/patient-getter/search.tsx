/**
 * Components that make queries delegate the query-making logic to a
 * `.resource.ts` function. This component simply calls `getPatient`
 * and sets a state variable using the result.
 */

// import { Trans } from "react-i18next";
// import Button from "carbon-components-react/es/components/Button";
// import { Tile } from "carbon-components-react/es/components/Tile";
// import { getPatient } from "./search.resource";
// import PageTitle from "../components/app-title-page/page-title"
// import { ExtensionSlot } from "@openmrs/esm-framework";
// import SearchPatient from "../components/searchInput"

import React, { useState } from "react";
import { Grid, Row, Column } from "carbon-components-react";
import style from "./search.scss";
import PatientFormRegistry from "../components/patient-form/new-patient-form"


export function PatientGetter() {
  const [patient, setPatient] = useState<fhir.Patient>();
  const patientName = "James";
  return (
    <div className={style.formatPage}>
      <div className={style.mainContainer}>
          <div className={style.self}>

            <PatientFormRegistry />
            
            {/* <PatientCard /> */}
            {/* <App /> */}
          </div>
      </div>
    </div>
  );













  // <ExtensionSlot extensionSlotName="breadcrumbs" />
  // <PageTitle />
  // <section className={style.container}>
  //   <SearchPatient />
  // </section> *









  // <div>
  //   <Button onClick={() => getPatient(patientName).then(
  //     (person)=>{
  //       console.log(person)
  //       setPatient(person)
  //     }
  //     )}>
  //     <Trans key="getPatient">Get a patient named</Trans> 'test'
  //   </Button>



  //   <Tile>
  //     {patient
  //       ? `${patient.name[0].given} ${patient.name[0].family} / ${patient.gender} / ${patient.birthDate}}`
  //       : null
  //       }
  //   </Tile>
  // </div>
  // );
}


