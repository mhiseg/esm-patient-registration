import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PatientFormRegistry, PatientProps } from "./components/patient-form/patient-registration/patient-form-registry";
import { usePatient } from "./components/patient-form/patient-registration/usePatient";


const PatientRegistration = () => {
    const param: {
        patientUuid?: string
    } = useParams();
    const { t } = useTranslation();
    const { isLoading: isLoadingPatientToEdit, patient: patientToEdit, relationships: relationshipsToEdit } = usePatient(param?.patientUuid);

    const getFormPatient = () => {

        return <>
            <h4 className={`title-page`}>{patientToEdit?.data ? t('editPatientTitle', 'Edit Patient') : t('savePatientTitle', 'New Patient')}</h4>
            <div className={`mhiseg-main-content `}>
                {patientToEdit?.data ? <PatientFormRegistry relationships={relationshipsToEdit.data.results} patient={patientToEdit.data} /> : <PatientFormRegistry />}
            </div>
        </>
    }
    return <> {isLoadingPatientToEdit === false && getFormPatient()} </>
};
export default PatientRegistration;