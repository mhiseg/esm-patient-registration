import { Column, Grid, Row } from "carbon-components-react";
import { FieldArray } from "formik";
import React, { useContext, useState } from "react";
import { Input } from "../../input/basic-input/input/input.component";
import { PhoneInput } from "../../input/custom-input/phone/phone-field.component";
import { Icon } from '@iconify/react';
import { PatientRegistrationContext } from '../../patient-registration-context';
import styles from "../../form.scss";
import FieldForm from "../../field.component";
import { PhoneField } from "../phone/phone-field.component";
import { FamilyNameField } from "../name/familyname-field.component";
import { GivenNameField } from "../name/givenname-field.component";
import { RelationTypeList } from "./relationshipList";
import { relationshipType, RelationshipValue } from "../../patient-registration-types";

export interface RelationshipsProps {
    values: any,
    relationships: relationshipType[];
}



export const RelationShips: React.FC<RelationshipsProps> = (values) => {
    const relationships: relationshipType = {
        givenName: "", familyName: "", contactPhone: "", uuid: ""
    };

    return (
        <FieldArray name="relationships" >{
            (arrayHelpers) => (
                <Column lg={12} className={styles.marginTop}>
                    <Grid className={styles.pm0} fullWidth={true}>
                        {values.relationships.map((r, index) => (
                            <Row key={index}>
                                <Column lg={3}>
                                    <RelationTypeList name={`relationships.[${index}].uuid`} />
                                </Column>
                                <Column lg={3} className={styles.pl0}>
                                    <GivenNameField name={`relationships.[${index}].givenName`} />
                                </Column>

                                <Column lg={3} className={styles.pl0}>
                                    <FamilyNameField name={`relationships.[${index}].familyName`} />
                                </Column>
                                <Column lg={2} className={styles.pl0}>
                                    <PhoneField name={`relationships.[${index}].contactPhone`} value={r.contactPhone} />
                                </Column>
                                <Column lg={1} className={styles.columnMaxSize}>
                                    {index == 0
                                        ? (
                                            <Icon
                                                icon="akar-icons:circle-plus-fill"
                                                inline={true}
                                                width="32"
                                                height="32"
                                                color="#699BF7"
                                                className={`${styles.buttonPlusStyle} ${styles.flexEnd}`}
                                                visibility={"visible"}
                                                onClick={() => {
                                                        arrayHelpers.unshift(relationships)
                                                    }
                                                }
                                            />
                                        )
                                        : (
                                            <Icon
                                                icon="akar-icons:circle-minus-fill"
                                                inline={true}
                                                width="32"
                                                height="32"
                                                color="#699BF7"
                                                className={`${styles.buttonPlusStyle} ${styles.flexEnd}`}
                                                onClick={() => arrayHelpers.remove(index)}
                                            />
                                        )
                                    }
                                </Column>
                            </Row>
                        ))}
                    </Grid>
                </Column>
            )
        }</FieldArray>
    );
}
