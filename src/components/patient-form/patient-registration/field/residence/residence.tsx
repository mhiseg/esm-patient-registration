// import { ChartMultitype16 } from "@carbon/icons-react";
// import React, { useContext, useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Autosuggest } from "../../input/custom-input/autosuggest/autosuggest.component";
// import { PatientRegistrationContext } from "../../patient-registration-context";
// import { Address } from "../../patient-registration-types";
// import { fetchAllLocation } from "../../patient-registration.ressources";

// interface BirthPlaceProps {
//     value?: Address;
//     className?: string;
// }

// const ResidenceField: React.FC<BirthPlaceProps> = ({ value }) => {
//     const [places, setPlaces] = useState<Address[]>([]);
//     const { t } = useTranslation();
//     const { setFieldValue } = useContext(PatientRegistrationContext);
//     const search = async (query: string) => {
//         return places.filter(place => place.cityVillage.toUpperCase().includes(query.toUpperCase()) || place.stateProvince.toUpperCase().includes(query.toUpperCase()))
//     };
//     useEffect(() => {
//         const unsubscribe = fetchAllLocation().then(res => setPlaces(res))
//         return () => { unsubscribe }
//     }, [])
//     return (
//         <>
//             <Autosuggest
//                 name="residence"
//                 placeholder={t("birthPlaceLabelText", "Lieu de naissance")}
//                 onSuggestionSelected={(field: string, selectedSuggestion: string) => {
//                     setFieldValue(field, selectedSuggestion);
//                 }}
//                 value={value?.display}
//                 getSearchResults={search}
//                 getDisplayValue={item => item.display}
//                 getFieldValue={item => item}
//             />
//         </>
//     );
// };

// export default ResidenceField;

import { Row, Column } from "carbon-components-react";
import { useField } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Autosuggest } from "../../input/custom-input/autosuggest/autosuggest.component";
import { PatientRegistrationContext } from "../../patient-registration-context";
import { Address } from "../../patient-registration-types";
import { fetchAllLocation } from "../../patient-registration.ressources";
import { AddressField } from "../address/address-field.component";
import styles from '../field.scss';


interface ResidenceProps {
    value?: Address;
    className?: string;
}
const ResidenceField: React.FC<ResidenceProps> = ({value}) => {
    const [places, setPlaces] = useState<Address[]>([]);
    const { t } = useTranslation();
    const [field, meta] = useField('residence');
    const { setFieldValue } = useContext(PatientRegistrationContext);
    const search = async (query: string) => {
        return places.filter(place => place.cityVillage.toUpperCase().includes(query.toUpperCase()) || place.stateProvince.toUpperCase().includes(query.toUpperCase()))
    };
    useEffect(() => {
        const unsubscribe = fetchAllLocation().then(res => setPlaces(res))
        return () => { unsubscribe }
    }, [])

    return (
        <>
            <Row>
                <Column>
                    <Autosuggest
                        name="residence"
                        placeholder={t("residenceLabelText", "Domicile")}
                        onSuggestionSelected={(field: string, selectedSuggestion: string) => {
                            setFieldValue(field, selectedSuggestion);
                        }}
                        value={value?.display}
                        getSearchResults={search}
                        getDisplayValue={item => item.display}
                        getFieldValue={item => item}
                    />
                    {meta.error && (
                        <div className={styles.fieldError}>{t("messageErrorResidence", 'Ce champs ne peut pas etre vide')}</div>
                    )}
                </Column>
                <Column>
                    <AddressField value={value?.address1} name="address" className={styles.margin_field} />
                </Column>
            </Row>
        </>
    );
};

export default ResidenceField;
