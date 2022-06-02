import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { mockGetSearchResults } from "../../input/custom-input/autosuggest/autocomplete";
import { Autosuggest } from "../../input/custom-input/autosuggest/autosuggest.component";
import { PatientRegistrationContext } from "../../patient-registration-context";



const BirthPlace: React.FC = () => {
    const { t } = useTranslation();
    const { setFieldValue } = useContext(PatientRegistrationContext);
    return (
        <>
            <Autosuggest
                name="birthPlace"
                placeholder={t("residenceLabelText", "Domicile")}
                onSuggestionSelected={(field: string, selectedSuggestion: string) => {
                    setFieldValue(field, selectedSuggestion);
                }}
                getSearchResults={mockGetSearchResults}
                getDisplayValue={item => item.display}
                getFieldValue={item => item.display}
            />
        </>
    );
};

export default BirthPlace;

