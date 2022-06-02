import { Column, Grid, Row } from "carbon-components-react";
import { FieldArray } from "formik";
import React, { useContext, useState } from "react";
import { Input } from "../../input/basic-input/input/input.component"
import { PhoneInput } from "../../input/custom-input/phone/phone-field.component";
import { Icon } from '@iconify/react';
import { FormValues, PatientRegistrationContext } from '../../patient-registration-context';

export interface RelationshipsProps {
    values: any,
    relationships: Array<any>;
}



export const RelationShips: React.FC<RelationshipsProps> = (values) => {
    const { setFieldValue } = useContext(PatientRegistrationContext);
    const [visibility, setVisibility] = useState("hidden")
    const handleChangeVisibility = (e) => {
        setVisibility("visible");
        console.log("updated")
    }
    return (
        <FieldArray name="personne" >{
            (arrayHelpers,) => (
                <Column lg={12} >
                    {values.relationships.map((index) => (
                        <Row key={index}>

                            <Column lg={4}>
                                <Input id="prenom" name={`personne.[${index}].prenomRef`} labelText="prenom" light={true} placeholder='Prenom' hideLabel={true} />
                            </Column>

                            <Column lg={4}>
                                <Input id="prenom" name={`personne.[${index}].nomRef`} labelText="prenom" light={true} placeholder='Nom' hideLabel={true} />
                            </Column>

                            <Column lg={4} >
                                {/* <Row> */}
                                <PhoneInput id="telephone" name={`personne.[${index}].telRef`} placeholder="Telephone" setPhoneValue={setFieldValue} />

                                {/* {values.relationships.length <= 1 && `personne.[${index}].prenomRef` != null && `personne.[${index}].nomRef` != null
                                            ? (
                                                <Icon
                                                    icon="akar-icons:circle-plus-fill"
                                                    inline={true}
                                                    width="32"
                                                    height="32"
                                                    color="#699BF7"
                                                    className=""
                                                    //visibility={visibility}
                                                    onClick={() => arrayHelpers.unshift({ prenomRef: "", nomRef: "", telRef: "" })}
                                                />
                                            )
                                            : (
                                                <Icon
                                                    icon="akar-icons:circle-minus-fill"
                                                    inline={true}
                                                    width="32"
                                                    height="32"
                                                    color="#699BF7"
                                                    // className={`${styles.iconStyle} ${styles.flexEnd}`}
                                                    onClick={() => arrayHelpers.remove(index)}
                                                />
                                            )
                                        } */}
                                {/* </Row> */}
                            </Column>


                            {/* <button type="button" onClick={() => arrayHelpers.remove(index)}> - </button> */}
                            {/* <button type="button" onClick={() => arrayHelpers.push({ prenomRef: "", nomRef: "", telRef: "" })} > + </button> */}

                        </Row>
                    ))}

                    {/* <Icon
                            icon="akar-icons:circle-minus-fill"
                            inline={true}
                            width="32"
                            height="32"
                            color="#699BF7"
                            className={`${styles.iconStyle} ${styles.flexEnd}`}
                            onClick={() => arrayHelpers.remove(index)}
                        /> */}
                </Column>

            )
        }</FieldArray>
    );
}
