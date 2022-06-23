import React, { useState } from "react";
import styles from "./form.scss"
import * as Yup from 'yup';
import { Formik } from "formik";
import { Grid, Row, Column, Button, Form } from "carbon-components-react";
import { useTranslation } from "react-i18next";
import { showToast } from "@openmrs/esm-framework";
import { Concept, Patient, PatientIdentifier, Relationships, relationshipType } from "./patient-registration-types";
import FieldForm from "./field.component";
import { RelationShips } from "./field/relationship/relationship-field-component";
import { PatientRegistrationContext } from "./patient-registration-context";
import { savePatient, generateIdentifier, saveAllConcepts, saveAllRelationships, formAddres, formatRelationship } from "./patient-registration.ressources";
import { countryName, habitatConcept, maritalStatusConcept, occupationConcept, sourceUuid, uuidBirthPlace, uuidIdentifier, uuidIdentifierLocation, uuidPhoneNumber } from "../../constants";
import { dob } from "./validation/validation-utils";

export interface PatientProps {
    patient?: Patient;
    relationships?: Relationships[];
    obs?: any[];
}

export const PatientFormRegistry: React.FC<PatientProps> = ({ patient, relationships, obs }) => {
    const abortController = new AbortController();
    const { t } = useTranslation();
    const formatInialValue = (patient) => {
        return {
            uuid: patient?.uuid,
            openmrsId: patient?.identifiers[0]?.identifier || "",
            relationships: formatRelationship(relationships),
            identifierType: patient?.identifiers[1]?.identifierType?.uuid || "",
            givenName: patient?.person?.names[0]?.givenName,
            dob: { birthdate: patient?.person?.birthdate, age: patient?.person?.age },
            status: getAnswerObs(maritalStatusConcept, obs),
            gender: patient?.person?.gender,
            birthPlace: formAddres(patient?.person?.attributes.find((attribute) => attribute?.attributeType?.uuid == uuidBirthPlace)?.value) || "",
            identifier: patient?.identifiers[1]?.identifier,
            familyName: patient?.person?.names[0]?.familyName,
            occupation: getAnswerObs(occupationConcept, obs),
            residence: null,//formAddres(patient?.person?.addresses[0]),
            address: formAddres(patient?.person?.addresses[0])?.address1 || "",
            phone: patient?.person?.attributes.find((attribute) => attribute.attributeType.uuid == uuidPhoneNumber)?.value || "",
            habitat: getAnswerObs(habitatConcept, obs),
        }
    }
    const getAnswerObs = (question: string, obs: any[]) => {
        return obs?.find((o) => o.concept.uuid === question)?.answer?.uuid || undefined;
    }
    
    const [initialV, setInitiatV] = useState(formatInialValue(patient));

    const patientSchema = Yup.object().shape({
        uuid: Yup.string(),
        openmrsId: Yup.string(),
        identifierType: Yup.string(),
        givenName: Yup.string().required("messageErrorGiveName"),
        dob: Yup.object({
            birthdate: Yup.date(),
            age: Yup.number(),
            months: Yup.number(),
            birthdateEstimated: Yup.boolean()
        }).test("validate date ", ("messageErrorDob"), (value, { createError }) => {
            return dob(value, createError);
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
                type: Yup.string(),
                personUuid: Yup.string(),
                relationUuid: Yup.string(),
            }).test("valide relationships ", (value, { createError }) => {
                if ((value.contactPhone == undefined) && (value.familyName == undefined) && (value.givenName == undefined) && (value.type == undefined))
                    return true;
                else if (value.contactPhone && value.familyName && value.givenName && value.type)
                    return true;
                else
                    return createError({
                        path: 'uuid',
                        message: (t("messageErrorRelationships", "Tout les champs doit être remplis")),
                    });
            }),
        )
    }).test("valide relationships ", (value, { createError }) => {
        if ((value.identifierType == undefined) && (value.identifier == undefined) || (value.identifierType && value.identifier)) {
            return true;
        }
        else if (!value.identifierType && value.identifier) {
            return createError({
                path: 'identifierType',
                message: "Vous devriez choisir le type d'identifiant",
            });
        }
        else if (value.identifierType && !value.identifier) {
            return createError({
                path: 'identifier',
                message: "Vous devriez fournir une valeur a l'identifiant",
            });
        } else if (value.identifier && value.identifier[0] == '3' && value.identifier.length == 10)
            return createError({
                path: 'identifier',
                message: "Format de CIN invalide",
            });
    });

    const save = async (id,values) => {
        let patient: Patient;
        let concepts: Concept[] = [];
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
                ...values.residence,
                country: countryName,
            })
        }
        if (values.status) {
            concepts.push({ uuid: maritalStatusConcept, answer: values.status });
        }
        if (values.occupation) {
            concepts.push({ uuid: occupationConcept, answer: values.occupation });
        }
        if (values.habitat) {
            concepts.push({ uuid: habitatConcept, answer: values.habitat });
        }
        savePatient(abortController, patient, values.uuid)
            .then(async (res) => {
                const person = res.data.uuid;
                if (values.relationships.length >= 1 && values.relationships[0].givenName)
                    await saveAllRelationships(values.relationships, person, abortController)
                await saveAllConcepts(concepts, person, abortController)
                showToast({
                    title: t('successfullyAdded', 'Successfully added'),
                    kind: 'success',
                    description: 'Patient save succesfully',
                })
            })
            .catch(error => {
                showToast({ description: error.message })
            })
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
                    setInitiatV(formatInialValue(patient));
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
                                        {FieldForm("dob", initialV?.dob)}
                                    </Column>
                                    <Column className={styles.secondColStyle} lg={6}>
                                        {FieldForm("birthPlace", values?.birthPlace)}
                                    </Column>
                                </Row>

                                <Row>
                                    <Column className={styles.firstColSyle} lg={6}>
                                        {FieldForm("phone")}
                                    </Column>
                                    <Column className={styles.secondColStyle} lg={6}>
                                        {FieldForm("residence", values?.residence)}
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
                                        <RelationShips relationships={values.relationships} />
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

