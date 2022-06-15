import React, { useState } from "react";
import styles from "./form.scss"
import * as Yup from 'yup';
import { Formik } from "formik";
import { Grid, Row, Column, Button, Form } from "carbon-components-react";
import { useTranslation } from "react-i18next";
import { showToast } from "@openmrs/esm-framework";
import { Patient, Relationship, relationshipType } from "./patient-registration-types";
import FieldForm from "./field.component";
import { RelationShips } from "./field/relationship/relationship-field-component";
import { PatientRegistrationContext } from "./patient-registration-context";
import { savePatient, generateIdentifier, sourceUuid, uuidIdentifierLocation, uuidIdentifier, uuidPhoneNumber, uuidBirthPlace, savePerson, saveRelationship, countryName, deletePatient } from "./patient-registration.resource";



const PatientFormRegistry = () => {
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
        dob: {birthdate: new Date()},
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
        dob: Yup.object({
            birthdate: Yup.date(),
            age: Yup.number(),
            months: Yup.number(),
            birthdateEstimated: Yup.boolean()
        }).test("validate date ", (t("messageErrorDob", "Tout les champs doit etre remplis")), (value) => {
            if ((value.birthdate === undefined) && (value.age === undefined))
                return false;
            else
                return true;
        }),
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
            }).test("valide relationships ", (t("messageErrorRelationships", "Tout les champs doit être remplis")), (value) => {
                if ((value.contactPhone == undefined) && (value.familyName == undefined) && (value.givenName == undefined) && (value.uuid == undefined))
                    return true;
                else if (value.contactPhone && value.familyName && value.givenName && value.uuid)
                    return true;
                else
                    return false;
            }),
        )
    }).test("valide relationships ", (t("messageErrorRelationships", "Tout les champs doit etre remplis")), (value) => {
        if ((value.identifierType == undefined) && (value.identifier == undefined) || (value.identifierType && value.identifier))
            return true;
        else
            return false;
    });
    const saveAllRelationships = async (relationships, patient) => {
        let persons = [];
        await relationships.map(relation => {
            persons.push({
                person: {
                    names: [{ givenName: relation.givenName, familyName: relation.familyName }],
                    gender: null,
                    attributes: [{ attributeType: uuidPhoneNumber, value: relation.contactPhone, }]
                },
                type: relation.uuid
            })
        })
        await Promise.all(persons.map(async person => {
            await savePerson(abortController, person.person).then(async pers => {
                const relation: Relationship = {
                    relationshipType: person.type,
                    personA: patient,
                    personB: pers.data.uuid
                };
                const relationshp = await saveRelationship(abortController, relation);
            })
        }))
        showToast({
            title: t('successfullyAdded', 'Successfully added'),
            kind: 'success',
            description: 'Patient save succesfully',
        })
    }

    const save = (id, values) => {
        patient = {
            identifiers: [{ identifier: id, identifierType: uuidIdentifier, location: uuidIdentifierLocation, preferred: true },],
            person: {
                names: [{ givenName: values.givenName, familyName: values.familyName, }],
                gender: values.gender,
                attributes: [],
            }
        }
        if (values.identifierType && values.identifier) {
            patient.identifiers.push({ identifier: values.identifier, identifierType: values.identifierType, })
        }
        if (values.dob.birthdateEstimated) {
            patient.person.birthdateEstimated = true;
            patient.person.age = values.dob.age;
        } else {
            patient.person.birthdate = new Date(values.dob.birthdate).toISOString();
        }
        if (values.birthPlace)
            patient.person.attributes = [{ attributeType: uuidBirthPlace, value: values.birthPlace.display, }]
        if (values.phone) {
            patient.person.attributes.push({ attributeType: uuidPhoneNumber, value: values.phone, })
        }
        if (values.residence) {
            patient.person.addresses = []
            patient.person.addresses.push({
                address1: values.adress,
                cityVillage: values.residence.city,
                stateProvince: values.residence.state,
                country: countryName,
            })
        }
        savePatient(abortController, patient)
            .then((res) => {
                if (values.relationships.length == 1 && !values.relationships[0].givenName) {
                    showToast({
                        title: t('successfullyAdded', 'Successfully added'),
                        kind: 'success',
                        description: 'Patient save succesfully',
                    })
                } else
                    saveAllRelationships(values.relationships, res.data.uuid)
            })
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
            {(formik, validationSchema) => {
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
                                setFieldValue: setFieldValue,
                                errors
                            }}>
                                <Row >
                                    <Column className={styles.firstColSyle} lg={6}>
                                        {FieldForm("idType")}
                                        {FieldForm("givenName")}
                                        {FieldForm("dob", initialV.dob)}
                                        {FieldForm("phone")}
                                        {FieldForm("gender")}
                                        {FieldForm("status")}
                                    </Column>
                                    <Column className={styles.secondColStyle} lg={6}>
                                        {FieldForm("idValue")}
                                        {FieldForm("familyName")}
                                        {FieldForm("birthPlace")}

                                        <Row>
                                            <Column>
                                                {FieldForm("residence")}
                                            </Column>
                                            <Column>
                                                {FieldForm("address")}
                                            </Column>
                                        </Row>

                                        {FieldForm("habitat")}
                                        {FieldForm("occupation")}
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