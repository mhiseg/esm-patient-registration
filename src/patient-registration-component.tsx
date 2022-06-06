import React from "react";
import { useTranslation } from "react-i18next";
import PatientFormRegistry from "./components/patient-form/patient-registration/patient-form-registry";


const PatientRegistration: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <h4 className={`title-page`}>{t('savePatientTitle', 'Save new Patient')}</h4>
            <div className={`mhiseg-main-content `}>
                <PatientFormRegistry />
            </div>
        </>
    );
};
export default PatientRegistration;



