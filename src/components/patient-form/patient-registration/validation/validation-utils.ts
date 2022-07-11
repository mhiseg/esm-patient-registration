import { useContext } from "react";
import { cinUuid, nifUuid } from "../../../constants";
import { PatientRegistrationContext } from "../patient-registration-context";
import { getPatient } from "../patient-registration.ressources";

export function dob(value, createError) {
    if ((value.birthdate === undefined) && (value.age === undefined)) {
        return createError({
            path: 'dob',
            message: ("messageErrorDOB"),
        });
    }
    else
        return true;
}

export async function validateId(value, createError) {
    
    if (value.identifier && value.identifier.replace(/\D/g, "").length == 10) {
        const patientSearch = await getPatient(value.identifier.replace(/\D/g, ""));
        if (patientSearch?.data?.results.length > 0 && patientSearch?.data?.results[0]?.identifiers[1].identifier !== value?.patient?.identifiers[1]?.identifier)
            return createError({
                path: 'identifier',
                message: ("messageErrorIdentifierExisted"),
            });
    }

    if ((value.identifierType == undefined) && (value.identifier == undefined)) {
        return true;
    }
    else if (!value.identifierType && value.identifier) {
        return createError({
            path: 'identifierType',
            message: ("messageErrorIdentifierType"),
        });
    }
    else if (value.identifierType && !value.identifier) {
        return createError({
            path: 'identifier',
            message: ("messageErrorIdentifier"),
        });
    }

    if (value.identifierType && value.identifier)
        if (value.identifierType == cinUuid && value.identifier.length != 10) {
            return createError({
                path: 'identifier',
                message: ("messageErrorCIN"),
            });
        }
    if (value.identifierType == nifUuid && value.identifier.length != 13) {
        return createError({
            path: 'identifier',
            message: ("messageErrorNIF"),
        });
    }
}

export function validateRelationShips(value, createError) {
    if ((value.contactPhone == undefined) && (value.familyName == undefined) && (value.givenName == undefined) && (value.type == undefined))
        return true;
    else if (value.contactPhone && value.familyName && value.givenName && value.type)
        return true;
    else
        return createError({
            path: 'type',
            message: ("messageErrorRelationships"),
        });
}

