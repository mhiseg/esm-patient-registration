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
import {
    savePatient, generateIdentifier, sourceUuid, uuidIdentifierLocation,
    uuidIdentifier, uuidPhoneNumber, uuidBirthPlace, savePerson, saveRelationship,
    countryName, deletePatient
} from "./patient-registration.resource";
import { dob, validateId, validateRelationShips } from "./validation/validation-utils";


const PatientFormRegistry = () => {
    const [identifiertype, setIdentifierType] = useState("CIN")
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
        dob: {},
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
        givenName: Yup.string().required("messageErrorGiveName"),
        dob: Yup.object({
            birthdate: Yup.date(),
            age: Yup.number(),
            months: Yup.number(),
            birthdateEstimated: Yup.boolean()
        }).test("validate date ", ("messageErrorDob"), (value,{createError}) => {
            return dob(value,createError);   
        }),
        status: Yup.string(),
        gender: Yup.string().required("messageErrorGender"),
        birthPlace: Yup.object(),
        identifier: Yup.string(),
        familyName: Yup.string().required("messageErrorFamilyName"),
        occupation: Yup.string(),
        residence: Yup.object(),
        adress: Yup.string(),
        phone: Yup.string().min(9, ("messageErrorPhoneNumber")),
        habitat: Yup.string(),
        relationships: Yup.array(
            Yup.object({
                givenName: Yup.string(),
                familyName: Yup.string(),
                contactPhone: Yup.string().min(9, ("messageErrorPhoneNumber")),
                uuid: Yup.string(),
            }).test("valide relationships ", (value, { createError }) => {
                return validateRelationShips(value,createError);
            }),
        )
    }).test("valide relationships ",(value, { createError }) => {
        if(value.adress && !value.residence){
            return createError({
                path: 'residence',
                message: ("messageErrorAdress"),
            });
        }
        else return true;
        return validateId(value,createError);
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
            {(formik) => {
                const {
                    values,
                    handleSubmit,
                    errors,
                    touched,
                    setFieldValue,
                    isValid,
                    dirty,
                } = formik;
                return (
                    <Form name="form" className={styles.cardForm} onSubmit={handleSubmit}>
                        <Grid fullWidth={true} className={styles.p0}>
                            <PatientRegistrationContext.Provider value={{ setFieldValue: setFieldValue, identifierType: values.identifierType }}>
                                <Row>
                                    <Column className={styles.firstColSyle} lg={6}>
                                        {FieldForm("idType")}
                                    </Column>
                                    <Column className={styles.secondColStyle} lg={6}>
                                        {FieldForm("idValue")}
                                    </Column>
                                </Row>
                                <Row>
                                    <Column className={styles.firstColSyle} lg={6}>
                                        {FieldForm("givenName")}
                                    </Column>
                                    <Column className={styles.secondColStyle} lg={6}>
                                        {FieldForm("familyName")}
                                    </Column>
                                </Row>
                                <Row>
                                    <Column className={styles.firstColSyle} lg={6}>
                                        {FieldForm("dob", initialV.dob)}
                                    </Column>
                                    <Column className={styles.secondColStyle} lg={6}>
                                        {FieldForm("birthPlace")}
                                    </Column>
                                </Row>

                                <Row>
                                    <Column className={styles.firstColSyle} lg={6}>
                                        {FieldForm("phone")}
                                    </Column>
                                    <Column className={styles.secondColStyle} lg={6}>
                                        <Row>
                                            <Column>
                                                {FieldForm("residence")}
                                            </Column>
                                            <Column>
                                                {FieldForm("address")}
                                            </Column>
                                        </Row>
                                    </Column>
                                </Row>
                                <Row>
                                    <Column className={styles.firstColSyle} lg={6}>
                                        {FieldForm("gender")}
                                    </Column>
                                    <Column className={styles.secondColStyle} lg={6}>
                                        {FieldForm("habitat")}
                                    </Column>
                                </Row>
                                <Row >
                                    <Column className={styles.firstColSyle} lg={6}>
                                        {FieldForm("status")}
                                    </Column>
                                    <Column className={styles.secondColStyle} lg={6}>
                                        {FieldForm("occupation")}
                                    </Column>
                                </Row>

                                <Row>
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
                                                        {t("cancelButton", "Annuler")}
                                                    </Button>
                                                    <Button
                                                        className={styles.buttonStyle1}
                                                        kind="tertiary"
                                                        type="submit"
                                                        size="sm"
                                                        isSelected={true}
                                                        disabled={!(dirty && isValid)}
                                                    >
                                                         {t("confirmButton", "Enregistrer")}
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