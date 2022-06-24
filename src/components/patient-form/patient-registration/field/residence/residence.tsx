import { useField } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Autosuggest } from "../../input/custom-input/autosuggest/autosuggest.component";
import { PatientRegistrationContext } from "../../patient-registration-context";
import { fetchAllLocation } from "../../patient-registration.resource";
import styles from '../field.scss';




const ResidenceField: React.FC = () => {
  const [field, meta] = useField('residence');
    const [places, setPlaces] = useState([]);
    const { t } = useTranslation();
    const { setFieldValue } = useContext(PatientRegistrationContext);
    const search = async (query: string) => {
        return places.filter(place => place.city.toUpperCase().includes(query.toUpperCase()))
    };
    useEffect(() => {
        const unsubscribe = fetchAllLocation().then(res => setPlaces(res))
        return () => { unsubscribe }
    }, [])

    return (
        <>
            <Autosuggest
                name="residence"
                placeholder={t("residenceLabelText", "Domicile")}
                onSuggestionSelected={(field: string, selectedSuggestion: string) => {
                    setFieldValue(field, selectedSuggestion);
                }}
                getSearchResults={search}
                getDisplayValue={item => item.display}
                getFieldValue={item => item}
            />
            {meta.error && (
        <div className={styles.fieldError}>{t("messageErrorResidence", 'Ce champs ne peut pas etre vide')}</div>
      )}
        </>
    );
};

export default ResidenceField;

