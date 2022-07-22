import React, { useState } from "react";
import styles from "./form.scss"
import * as Yup from 'yup';
import { Formik } from "formik";
import { Grid, Row, Column, Button, Form } from "carbon-components-react";
import { useTranslation } from "react-i18next";
import { navigate, NavigateOptions, showToast } from "@openmrs/esm-framework";
import { Obs, Patient, relationshipType } from "./patient-registration-types";
import FieldForm from "./field.component";
import { RelationShips } from "./field/relationship/relationship-field-component";
import { PatientRegistrationContext } from "./patient-registration-context";
import { savePatient, generateIdentifier, saveAllConcepts, saveAllRelationships, formAddres, formatRelationship } from "./patient-registration.ressources";
import { cinUuid, countryName, habitatConcept, maritalStatusConcept, occupationConcept, sourceUuid, uuidBirthPlace, uuidIdentifier, uuidIdentifierLocation, uuidPhoneNumber } from "../../constants";
import { dob, validateRelationShips, validateId } from "./validation/validation-utils";
import { formatCin, formatNif } from "./input/custom-input/idenfiersInput/id-utils";

export interface PatientProps {
    patient?: Patient;
    relationships?: relationshipType[];
    obs?: Obs[];
}

export const PatientFormRegistry: React.FC<PatientProps> = ({ patient, relationships, obs }) => {
    const abortController = new AbortController();
    const toSearch: NavigateOptions = { to: window.spaBase + "/death/search" };
    const reload: NavigateOptions = { to: window.location.href };
    const { t } = useTranslation();

    const format = (identifierType, value) => {
        if (identifierType == cinUuid)
            return formatCin(value);
        else
            return formatNif(value);
    }

    const formatInialValue = (patient, obs, getAnswerObs) => {

        console.log({ birthdate: patient?.person?.birthdate, age: patient?.person?.age },'----------------------')
        return {
            uuid: patient?.uuid,
            encounterUuid: obs ? obs[0]?.encounter : undefined,
            relationships: relationships?.length > 0 ? relationships : [{ givenName: undefined, familyName: undefined, contactPhone: undefined, type: undefined, personUuid: undefined, relationUuid: undefined }],
            identifierType: patient?.identifiers[1]?.identifierType?.uuid || null,
            identifierUuid: patient?.identifiers[1]?.uuid || "",
            givenName: patient?.person?.names[0]?.givenName,
            dob: { birthdate: patient?.person?.birthdate, age: patient?.person?.age },
            status: getAnswerObs(maritalStatusConcept, obs),
            gender: patient?.person?.gender,
            birthPlace: formAddres(patient?.person?.attributes.find((attribute) => attribute?.attributeType?.uuid == uuidBirthPlace)?.value) || "",
            identifier: format(patient?.identifiers[1]?.identifierType?.uuid, patient?.identifiers[1]?.identifier),
            familyName: patient?.person?.names[0]?.familyName,
            occupation: getAnswerObs(occupationConcept, obs),
            residence: formAddres(patient?.person?.addresses[0]) || "",
            phone: patient?.person?.attributes.find((attribute) => attribute.attributeType.uuid == uuidPhoneNumber)?.value || "",
            habitat: getAnswerObs(habitatConcept, obs),
            patient: patient,
        }
    }
    const getAnswerObs = (question: string, obs: Obs[]) => {
        return obs?.find((o) => o?.concept === question) || { concept: question };
    }

    const [initialV, setInitialV] = useState(formatInialValue(patient, obs, getAnswerObs));
    const patientSchema = Yup.object().shape({
        uuid: Yup.string(),
        openmrsId: Yup.string(),
        identifierType: Yup.string().nullable(),
        givenName: Yup.string().required("messageErrorGivenName"),
        dob: Yup.object({
            birthdate: Yup.date(),
            age: Yup.number(),
            months: Yup.number(),
            birthdateEstimated: Yup.boolean()
        }).test("validate date ", ("messageErrorDob"), (value, { createError }) => {
            return dob(value, createError);
        }),
        status: Yup.object(),
        gender: Yup.string().required("messageErrorGender"),
        birthPlace: Yup.object(),
        identifier: Yup.string(),
        familyName: Yup.string().required("messageErrorFamilyName"),
        occupation: Yup.object(),
        residence: Yup.object().nullable(),
        address: Yup.string(),
        phone: Yup.string().min(9, ("messageErrorPhoneNumber")),
        habitat: Yup.object(),
        relationships: Yup.array(
            Yup.object({
                givenName: Yup.string(),
                familyName: Yup.string(),
                contactPhone: Yup.string().min(9, ("messageErrorPhoneNumber")),
                type: Yup.string(),
                personUuid: Yup.string(),
                relationUuid: Yup.string(),
            }).test("valide relationships ", (value, { createError }) => {
                return validateRelationShips(value, createError);
            }),
        )
    }).test("valide relationships ", (value, { createError }) => {
        if (value.address && !value.residence) {
            return createError({
                path: 'residence',
                message: ("messageErrorResidence"),
            });
        }
        return validateId(value, createError);
    });

    const save = async (id, values, resetForm) => {
        let patient: Patient;
        let concepts: Obs[] = [];
        patient = {
            identifiers: [{ identifier: id, identifierType: uuidIdentifier, location: uuidIdentifierLocation, preferred: true }],
            person: {
                names: [{ givenName: values.givenName, familyName: values.familyName, }],
                gender: values.gender,
                attributes: [],
            }
        }
        if (values.identifierType && values.identifier) {
            patient.identifiers.push({ identifier: values.identifier.replace(/\D/g, ""), identifierType: values.identifierType, uuid: values.identifierUuid == "" ? null : values.identifierUuid })
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
            patient.person.addresses = [];
            patient.person.addresses.push({
                ...values.residence,
                country: countryName,
            })
        }
        if (values.status) {
            concepts.push({ ...values.status });
        }
        if (values.occupation) {
            concepts.push({ ...values.occupation });
        }
        if (values.habitat) {
            concepts.push({ ...values.habitat });
        }
        savePatient(abortController, patient, values.uuid)
            .then(async (res) => {
                const person = res.data.uuid;
                const relationships: relationshipType[] = values.relationships.filter(relationship => (relationship.givenName || relationship.relationUuid));
                if (relationships.length > 0)
                    await saveAllRelationships(relationships, person, abortController)
                await saveAllConcepts(concepts, person, abortController, values.encounterUuid)
                if (values.uuid) {
                    navigate(reload);
                } else {
                    resetForm({
                        uuid: "",
                        encounterUuid: "",
                        relationships: formatRelationship([]),
                        identifierType: "",
                        identifierUuid: "",
                        givenName: "",
                        dob: { birthdate: undefined, age: undefined },
                        status: getAnswerObs(maritalStatusConcept, [{}]),
                        gender: "",
                        birthPlace: { cityVillage: "", stateProvince: "", country: "", display: "" },
                        identifier: "",
                        familyName: "",
                        occupation: getAnswerObs(occupationConcept, [{}]),
                        residence: "",
                        phone: "",
                        habitat: getAnswerObs(habitatConcept, [{}]),
                        patient: undefined
                    });
                }
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
            enableReinitialize
            initialValues={initialV}
            validationSchema={patientSchema}
            onSubmit={
                async (values, { setSubmitting, resetForm }) => {
                    setSubmitting(false)
                    const id = await generateIdentifier(sourceUuid, abortController);
                    save(id.data.identifier, values, resetForm);
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
                    dirty
                } = formik;
                return (
                    <Form name="form" className={styles.cardForm} onSubmit={handleSubmit}>
                        <Grid fullWidth={true} className={styles.p0}>
                            <PatientRegistrationContext.Provider value={{ setFieldValue: setFieldValue, identifierType: values.identifierType, patient: null }}>
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
                                        {FieldForm("status", values?.status)}
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
                                                        onClick={() => navigate(toSearch)}
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

