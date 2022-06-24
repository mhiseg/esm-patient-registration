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

export function validateId(value, createError) {
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
        if (value.identifierType[0] == '3' && value.identifier.length < 10) {
            return createError({
                path: 'identifier',
                message: ("messageErrorCIN"),
            });
        }
    if (value.identifierType[0] == '2' && value.identifier.length < 13) {
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

