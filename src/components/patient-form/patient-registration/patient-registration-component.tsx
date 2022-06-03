import React, { useState } from "react";
import styles from "./form.scss"
import { NumberInput } from "carbon-components-react/lib/components/NumberInput/NumberInput";
import { Icon } from '@iconify/react';
import * as Yup from 'yup';
import { Formik } from "formik";
import FieldForm from "./field.component";
import { PatientRegistrationContext } from "./patient-registration-context";
import { Grid, Row, Column, Button, DatePicker, DatePickerInput, Form } from "carbon-components-react";
import { RelationShips } from "./field/relationship/relationship-field-component";
import { generateIdentifier,savePatient,sourceUuid } from "./patient-registration.resource";
import { Patient } from "./patient-registration-types";
import { useTranslation } from "react-i18next";
import { showToast } from "@openmrs/esm-framework";



const PatientFormRegistry = () => {

    function today() {
        return new Date().toLocaleDateString("fr");
    }
    const abortController = new AbortController();
    const { t } = useTranslation();
    let patient: Patient;
    
    const [initialV, setInitiatV] = useState({
        relationships: [{ prenomRef: "", nomRef: "", telRef: "" }],
        identifierType: "",
        firstName: "",
        dob: today(),
        status: "",
        gender: "",
        birthPlace: "",
        identifiers: "",
        familyName: "",
        occupation: "",
        residence: "",
        adress: "",
        phone: "",
        habitat: "",
    });

    const patientSchema = Yup.object().shape({
        identifierType: Yup.string(),
        firstName: Yup.string().required("Le prenom ne peut pas etre vide"),
        dob: Yup.date(),
        status: Yup.string(),
        gender: Yup.string().required("Le patient doit avoir un genre"),
        birthPlace: Yup.string(),
        identifiers: Yup.number(),
        familyName: Yup.string().required("Le nom ne peut pas etre vide"),
        occupation: Yup.string(),
        residence: Yup.string(),
        adress: Yup.string(),
        phone: Yup.string(),
        habitat: Yup.string(),
        relationships: Yup.array(
            Yup.object({
                prenomRefValue: Yup.boolean(),
                nomRefValue: Yup.boolean(),
                telRefValue: Yup.boolean(),
                prenomRef: Yup.string().when('prenomRefValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') }),
                nomRef: Yup.string().when('nomRefValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') }),
                telRef: Yup.string().when('telRefValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') })
            })
        )
    });

    const save = (id, values) => {
        console.log(id,'====',values)
        patient = {
            identifiers: [{
                identifier: id,
                identifierType: "05a29f94-c0ed-11e2-94be-8c13b969e334",
                location: "8d6c993e-c2cc-11de-8d13-0010c6dffd0f",
                preferred: false
            }],
            person: {
                names: [
                    {
                        givenName: values.firstName,
                        familyName: values.familyName,
                    }
                ],
                gender: values.gender,
                birthdate: new Date(values.dob).toISOString(),
                birthdateEstimated: false,
                addresses: [
                    {
                        address1: values.adress,
                        cityVillage: values.residence,
                        stateProvince: 'Ouest',
                        country: 'Haiti',
                    },
                ],
            }
        }
        console.log('to save',patient)
        savePatient(abortController, patient, null)
            .then(res => showToast({
                title: t('successfullyAdded', 'Successfully added'),
                kind: 'success',
                description: 'Patient save succesfully',
            }))
            .catch(error => showToast({ description: error.message }))
    }

    return (
        <Formik
            initialValues={initialV}
            validationSchema={patientSchema}
            onSubmit={
                async (values) => {
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
                    setValues
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
                                        {FieldForm("firstName")}

                                        <Row className={styles.marginSelect}>
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
                                                // onClose={changeState(true)}
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
                                        </Row>

                                        {FieldForm("statu")}

                                        {FieldForm("gender")}

                                        {FieldForm("residence")}


                                    </Column>


                                    <Column className={styles.secondColStyle} lg={6}>
                                        {FieldForm("idValue")}

                                        {FieldForm("lastName")}

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