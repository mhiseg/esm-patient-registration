import { Column, Grid, Modal, Row } from "carbon-components-react";
import { FieldArray } from "formik";
import React, { useContext, useState } from "react";
import { Icon } from '@iconify/react';
import styles from "../../form.scss";
import { PhoneField } from "../phone/phone-field.component";
import { FamilyNameField } from "../name/familyname-field.component";
import { GivenNameField } from "../name/givenname-field.component";
import { RelationTypeList } from "./relationshipList";
import { relationshipType } from "../../patient-registration-types";
import { useTranslation } from 'react-i18next';
import { showToast } from "@openmrs/esm-framework";
import { deletePerson, deleteRelationship } from "../../patient-registration.ressources";
import { ConfirmationModal } from "../../widget/confirmation-modal";



export interface RelationshipsProps {
    relationships: relationshipType[];
}

export const RelationShips: React.FC<RelationshipsProps> = (values) => {
    const { t } = useTranslation();
    const abortController = new AbortController();
    const [stateModal, setStateModal] = useState(false);
    const relationships: relationshipType = {
        givenName: undefined, familyName: undefined, contactPhone: undefined, type: "", personUuid: undefined, relationUuid: undefined
    };

    async function removeRelationShip(values, index, arrayHelpers) {
        if (!values.relationships[index]?.personUuid && !values.relationships[index]?.relationUuid) {
            arrayHelpers.remove(index);
        }
        else {
            deleteRelationship(abortController, values.relationships[index].relationUuid, values.relationships[index].personUuid)
            .then(res => {
                arrayHelpers.remove(index);
                showToast({
                    title: t('successfullyRemoved', 'Successfully removed'),
                    kind: 'success',
                    description: 'Relationship removed succesfully',
                })
            })
            .catch(error => showToast({ description: "Failed to delete relationships" }))
        }
    }

    return (
        <div className={styles.marginTop}>
            <FieldArray name="relationships" >{
                (arrayHelpers) => (
                    <Column lg={12} className={styles.marginTop} >
                        <Grid className={styles.pm0} fullWidth={true}>
                            {values.relationships?.map((r, index) => (
                                <Row key={index} className={styles.pl0} >
                                    <input id={`relationships.[${index}].relationUuid`} name={`relationships.[${index}].relationUuid`} value={r.relationUuid} hidden={true} />
                                    <input id={`relationships.[${index}].personUuid`} name={`relationships.[${index}].personUuid`} value={r.personUuid} hidden={true} />
                                    <Column lg={3} className={styles.pl0}>
                                        <RelationTypeList name={`relationships.[${index}].type`} />
                                    </Column>
                                    <Column lg={3} className={styles.pl0}>
                                        <FamilyNameField name={`relationships.[${index}].familyName`} />
                                    </Column>
                                    <Column lg={3} className={styles.pl0}>
                                        <GivenNameField name={`relationships.[${index}].givenName`} />
                                    </Column>
                                    <Column lg={3} className={styles.pl0}>
                                        <PhoneField name={`relationships.[${index}].contactPhone`} value={r.contactPhone} className={styles.columnMaxSize} />
                                    </Column>
                                    <div className={styles.buttonPosition}>
                                        {
                                            (index == 0 && values.relationships[0].givenName && values.relationships[0].familyName && values.relationships[0].type && values.relationships[0].contactPhone?.length == 9)
                                                ? (
                                                    <Icon
                                                        icon="akar-icons:circle-plus-fill"
                                                        inline={true}
                                                        width="32"
                                                        height="32"
                                                        color="#699BF7"
                                                        className={`${styles.buttonPlusStyle} ${styles.flexEnd}`}
                                                        onClick={() => {
                                                            arrayHelpers.unshift(relationships)
                                                            console.log("================= relationships",arrayHelpers);
                                                        }
                                                        }
                                                    />
                                                ) : ""
                                        }
                                        {index > 0 && (
                                            <Icon
                                                icon="akar-icons:circle-minus-fill"
                                                inline={true}
                                                width="32"
                                                height="32"
                                                color="#699BF7"
                                                className={`${styles.buttonPlusStyle} ${styles.flexEnd}`}
                                                onClick={() => {
                                                    setStateModal(true);
                                                }
                                                }
                                            />
                                        )
                                        }
                                        {<ConfirmationModal
                                            conFirmModal={() => {
                                                removeRelationShip(values, index, arrayHelpers);
                                                setStateModal(false)
                                            }}
                                            modalState={stateModal}
                                            closeModal={setStateModal} />}
                                    </div>
                                </Row>
                            ))}
                        </Grid>
                    </Column>
                )
            }</FieldArray>
        </div>
    );
}


