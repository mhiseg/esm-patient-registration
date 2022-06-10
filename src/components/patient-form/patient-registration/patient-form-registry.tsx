import React, { useContext, useEffect, useState } from "react";
import styles from "./form.scss"
import { NumberInput } from "carbon-components-react/lib/components/NumberInput/NumberInput";
import * as Yup from 'yup';
import { Formik } from "formik";
import { Grid, Row, Column, Button, DatePicker, DatePickerInput, Form } from "carbon-components-react";
import { useTranslation } from "react-i18next";
import { showToast } from "@openmrs/esm-framework";
import { Patient, Relationship, relationshipType } from "./patient-registration-types";
import FieldForm from "./field.component";
import { RelationShips } from "./field/relationship/relationship-field-component";
import { PatientRegistrationContext } from "./patient-registration-context";
import { savePatient, generateIdentifier, sourceUuid, uuidIdentifierLocation, uuidIdentifier, uuidPhoneNumber, uuidBirthPlace, savePerson, saveRelationship, countryName, deletePatient } from "./patient-registration.resource";



const PatientFormRegistry = () => {

    //const {state}=useContext(PatientRegistrationContext)
    const abortController = new AbortController();
    const { t } = useTranslation();
    let patient: Patient;
    let relationshipType: relationshipType[] = [{
        givenName: "", familyName: "", contactPhone: "", uuid: ""
    }];
    const [initialV, setInitiatV] = useState({
        relationships: relationshipType,
        identifierType: "",
        givenName: "",
        dob:{birthdate: null, age:1, months: 4, birthdateEstimated: true},
        status: "",
        gender: "",
        birthPlace: "",
        identifier: "",
        familyName: "",
        occupation: "",
        residence: "",
        adress: "",
        phone: "",
        habitat: "",
    });

    const patientSchema = Yup.object().shape({
        identifierType: Yup.string(),
        givenName: Yup.string().required(t("messageErrorGiveName", "Give name can't null")),
        dob: Yup.object(),
        status: Yup.string(),
        gender: Yup.string().required(t("messageErrorGender", "Gender is required")),
        birthPlace: Yup.object(),
        identifier: Yup.number(),
        familyName: Yup.string().required(t("messageErrorFamilyName", "Family Name is required")),
        occupation: Yup.string(),
        residence: Yup.object(),
        adress: Yup.string(),
        phone: Yup.string().min(9, (t("messageErrorPhoneNumber", "Format de téléphone incorrect"))),
        habitat: Yup.string(),
        relationships: Yup.array(
            Yup.object({
                givenName: Yup.string(),
                familyName: Yup.string(),
                contactPhone: Yup.string().min(9, (t("messageErrorPhoneNumber", "Format de téléphone incorrect"))),
                uuid: Yup.string(),
            }).test("valide relationships ", (t("messageErrorRelationships", "Tout les champs doit etre remplis")), (value) => {
                
                return !(value.contactPhone || value.familyName || value.givenName || value.uuid);
            }),
        )
    });
    const saveAllRelationships = async (relationships, patient) => {
        let test;
        let persons = [];

        relationships.map(relation => {

            persons.push({
                person: {
                    names: [{ givenName: relation.givenName, familyName: relation.familyName }],
                    gender: null,
                    attributes: [{ attributeType: uuidPhoneNumber, value: relation.contactPhone, }]
                },
                type: relation.uuid
            })

        })
        persons.map(person => {
            savePerson(abortController, person.person).then(pers => {
                const relation: Relationship = {
                    relationshipType: person.type,
                    personA: patient,
                    personB: pers.data.uuid
                };
                console.log('relationships to save', relation)

                saveRelationship(abortController, relation).then((r) => {
                    return { test: true, person: pers.data }
                })
            })
        })
        // if (test === true)
        //     showToast({
        //         title: t('successfullyAdded', 'Successfully added'),
        //         kind: 'success',
        //         description: 'Patient save succesfully',
        //     })
        // else{
        //     showToast({ description: "error" })
        //     deletePatient(patient, abortController)            
        // }

    }
    const save = (id, values) => {
        console.log(id, '====', values)
        patient = {
            identifiers: [
                {
                    identifier: id,
                    identifierType: uuidIdentifier,
                    location: uuidIdentifierLocation,
                    preferred: true
                },
                {
                    identifier: values.identifier,
                    identifierType: values.identifierType,
                }
            ],
            person: {
                names: [
                    {
                        givenName: values.givenName,
                        familyName: values.familyName,
                    }
                ],
                gender: values.gender,
                birthdate: new Date().toISOString(),//(values.dob).toISOString(),
                birthdateEstimated: true,
                // age: 
                addresses: [
                    {
                        address1: values.adress,
                        cityVillage: values.residence.city,
                        stateProvince: values.residence.state,
                        country: countryName,
                    },
                ],
                attributes: [
                    {
                        attributeType: uuidBirthPlace,
                        value: values.birthPlace.display,
                    },
                    {
                        attributeType: uuidPhoneNumber,
                        value: values.phone,
                    }
                ]
            }
        }
        console.log('to save', patient)
        savePatient(abortController, patient)
            .then((res) => saveAllRelationships(values.relationships, res.data.uuid))
            .catch(error => showToast({ description: error.message }))
    }

    return (
        <Formik
            initialValues={initialV}
            validationSchema={patientSchema}
            onSubmit={
                async (values, { setSubmitting, resetForm }) => {
                    setSubmitting(false)
                    const id = await generateIdentifier(sourceUuid, abortController);
                    save(id.data.identifier, values)
                    resetForm(values);

                }
            }

        >
            {(formik,validationSchema) => {
                const {
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched,
                    handleBlur,
                    setFieldValue,
                    isValid,
                    dirty,
                    setValues,
                } = formik;
                return (
                    <Form name="form" className={styles.cardForm} onSubmit={handleSubmit}>
                        <Grid fullWidth={true} className={styles.p0}>
                            <PatientRegistrationContext.Provider value={{
                                setFieldValue: setFieldValue, state: []
                            }}>
                                <Row >
                                    <Column className={styles.firstColSyle} lg={6}>
                                        {FieldForm("idType")}
<<<<<<< HEAD
                                        {FieldForm("givenName")}
                                        {FieldForm("dob",initialV.dob)}                     
=======

                                        {FieldForm("givenName")}

                                        {FieldForm("dob")}

>>>>>>> 396dd2bb4c32ef8fe964fdb9b259fa45b506a6dd
                                        {FieldForm("statu")}
                                        {FieldForm("gender")}
                                        {FieldForm("residence")}
                                    </Column>
                                    <Column className={styles.secondColStyle} lg={6}>
                                        {FieldForm("idValue")}
                                        {FieldForm("familyName")}
                                        {FieldForm("birthPlace")}
                                        {FieldForm("occupation")}
                                        {FieldForm("habitat")}
                                        {FieldForm("address")}
                                        {FieldForm("phone",validationSchema)}
                                    </Column>

                                    <Column>
                                        <RelationShips values={values} relationships={values.relationships} />
                                    </Column>
                                </Row>
                                <Row>
                                    <Column>
                                        <Row>
                                            <Column className={styles.marginTop} lg={12} >
                                                <div className={styles.flexEnd}>
                                                    <Button
                                                        className={styles.buttonStyle}
                                                        kind="danger--tertiary"
                                                        type="reset"
                                                        size="sm"
                                                        isSelected={true}
                                                    >
                                                        Annuler
                                                    </Button>
                                                    <Button
                                                        className={styles.buttonStyle1}
                                                        kind="tertiary"
                                                        type="submit"
                                                        size="sm"
                                                        isSelected={true}
                                                        disabled={!(dirty && isValid)}
                                                    >
                                                        Enregistrer
                                                    </Button>
                                                </div>
                                            </Column>
                                        </Row>
                                    </Column>
                                </Row>
                            </PatientRegistrationContext.Provider>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default PatientFormRegistry;