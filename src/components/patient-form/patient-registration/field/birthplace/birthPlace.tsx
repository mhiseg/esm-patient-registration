import { ChartMultitype16 } from "@carbon/icons-react";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { mockGetSearchResults } from "../../input/custom-input/autosuggest/autocomplete";
import { Autosuggest } from "../../input/custom-input/autosuggest/autosuggest.component";
import { PatientRegistrationContext } from "../../patient-registration-context";
import { fetchAllLocation } from "../../patient-registration.resource";



const BirthPlace: React.FC = () => {
    const [places, setPlaces] = useState([]);
    const { t } = useTranslation();
    const { setFieldValue } = useContext(PatientRegistrationContext);      
    const search = async (query: string) => {
        return  places.filter(place => place.city.toUpperCase().includes(query.toUpperCase()))
    };
    useEffect(() => {
        fetchAllLocation().then(res => {
            setPlaces(res)})
    }, [places])

    return (
        <>
            <Autosuggest
                name="birthPlace"
                placeholder={t("birthPlaceLabelText", "Lieu de naissance")}
                onSuggestionSelected={(field: string, selectedSuggestion: string) => {
                    setFieldValue(field, selectedSuggestion);
                }}
                getSearchResults={search}
                getDisplayValue={item => item.display}
                getFieldValue={item => item}
            />
        </>
    );
};

export default BirthPlace;

