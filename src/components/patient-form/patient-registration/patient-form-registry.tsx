import React, { useEffect, useState } from "react";
import styles from "./form.scss"
import { NumberInput } from "carbon-components-react/lib/components/NumberInput/NumberInput";
import * as Yup from 'yup';
import { Formik } from "formik";
import { Grid, Row, Column, Button, DatePicker, DatePickerInput, Form } from "carbon-components-react";
import { useTranslation } from "react-i18next";
import { showToast } from "@openmrs/esm-framework";
import { Patient, Relationship } from "./patient-registration-types";
import FieldForm from "./field.component";
import { RelationShips } from "./field/relationship/relationship-field-component";
import { PatientRegistrationContext } from "./patient-registration-context";
import { savePatient, generateIdentifier, sourceUuid, uuidIdentifierLocation, uuidIdentifier, uuidPhoneNumber, uuidBirthPlace, savePerson, saveRelationship, countryName, deletePatient } from "./patient-registration.resource";



const PatientFormRegistry = () => {


    const abortController = new AbortController();
    const { t } = useTranslation();
    let patient: Patient;

    const [initialV, setInitiatV] = useState({
        relationships: [{ givenName: "", familyName: "", contactPhone: "", type: "" }],
        identifierType: "",
        givenName: "",
        dob: new Date(),
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
        dob: Yup.date(),
        status: Yup.string(),
        gender: Yup.string().required(t("messageErrorGender", "Gender is required")),
        birthPlace: Yup.object(),
        identifier: Yup.number(),
        familyName: Yup.string().required(t("messageErrorFamilyName", "Family Name is required")),
        occupation: Yup.string(),
        residence: Yup.object(),
        adress: Yup.string(),
        phone: Yup.string(),
        habitat: Yup.string(),
        relationships: Yup.array(
            Yup.object({
                givenNameValue: Yup.boolean(),
                familyNameValue: Yup.boolean(),
                phoneValue: Yup.boolean(),
                givenName: Yup.string().when('givenNameValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') }),
                familyName: Yup.string().when('familyNameValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') }),
                phone: Yup.string().when('phoneValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') })
            })
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
                type: relation.type
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
                async (values, { setSubmitting }) => {
                    setSubmitting(false)
                    const id = await generateIdentifier(sourceUuid, abortController);
                    save(id.data.identifier, values)
                }
            }

        >
            {(formik) => {
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
                    <Form className={styles.cardForm} onSubmit={handleSubmit}>
                        <Grid fullWidth={true} className={styles.p0}>
                            <PatientRegistrationContext.Provider value={{
                                setFieldValue: setFieldValue,
                            }}>
                                <Row >
                                    <Column className={styles.firstColSyle} lg={6}>
                                        {FieldForm("idType")}
                                        {FieldForm("givenName")}
                                        {FieldForm("dob")}

                                        {/* <Row className={styles.marginSelect}>
                                            <Column sm={4} md={8} lg={6}>
                                                <DatePicker
                                                    className=""
                                                    maxDate={today()}
                                                    datePickerType="single"
                                                    locale="fr"
                                                    dateFormat="d/m/Y"
                                                    light={true}
                                                    value={values.dob}
                                                    onChange={date => setFieldValue('dob', date)}
                                                >
                                                    <DatePickerInput
                                                        id="date-picker-simple"
                                                        labelText="Date Picker label"
                                                        hideLabel={true}
                                                        placeholder="dd/mm/yyyy"
                                                        size="md"
                                                    />
                                                </DatePicker>
                                            </Column>

                                            <Column sm={4} md={8} lg={6}>
                                                <Row>
                                                    <Column >
                                                        <NumberInput
                                                            id="carbon-number"
                                                            invalidText="L'age ne doit pas etre inferieur a 0 et superieur 1000"
                                                            max={1000}
                                                            min={0}
                                                            size="md"
                                                            value={0}
                                                            allowEmpty={true}
                                                            light={true}
                                                            hideSteppers={true}
                                                        />
                                                        <span>ans</span>
                                                    </Column>

                                                    <Column >
                                                        <NumberInput
                                                            id="carbon-number"
                                                            invalidText="Le nombre de mois doit etre compris entre 1 et 12"
                                                            max={11}
                                                            min={1}
                                                            size="md"
                                                            value={1}
                                                            allowEmpty={true}
                                                            light={true}
                                                            hideSteppers={true}
                                                            readOnly={true}
                                                        />
                                                        <span>mois</span>
                                                    </Column >
                                                </Row>
                                            </Column>
                                        </Row> */}

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

                                        {FieldForm("phone")}
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