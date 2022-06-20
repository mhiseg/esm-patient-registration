export const basePath = '${openmrsSpaBase}/patient/';
export const encounterRepresentation =
  'custom:(uuid,encounterDatetime,encounterType,location:(uuid,name),' +
  'patient:(uuid,display),encounterProviders:(uuid,provider:(uuid,name)),' +
  'obs:(uuid,obsDatetime,voided,groupMembers,concept:(uuid,name:(uuid,name)),value:(uuid,name:(uuid,name),' +
  'names:(uuid,conceptNameType,name))))';

export const uuidIdentifier = '05a29f94-c0ed-11e2-94be-8c13b969e334';
export const uuidIdentifierLocation = '8d6c993e-c2cc-11de-8d13-0010c6dffd0f';
export const uuidPhoneNumber = '14d4f066-15f5-102d-96e4-000c29c2a5d7';
export const sourceUuid = "691eed12-c0f1-11e2-94be-8c13b969e334";
export const uuidBirthPlace = "8d8718c2-c2cc-11de-8d13-0010c6dffd0f";
export const unknowLocation = "58c57d25-8d39-41ab-8422-108a0c277d98";
export const encounterTypeCheckIn = "67a71486-1a54-468f-ac3e-7091a9a79584"
export const countryName = "Haiti";
// registration concept
export const maritalStatusConcept = '1054AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const occupationConcept = '1542AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const habitatConcept = "965014a7-644d-4df8-898b-33cb4d76c326";


// Encounter types
export const htsRetrospectiveEncounterType = '79c1f50f-f77d-42e2-ad2a-d29304dde2fe';
export const covidCaseAssessmentEncType = '253a43d3-c99e-415c-8b78-ee7d4d3c1d54';
export const covidVaccinationEncType = '5b37ce7a-c55e-4226-bdc8-5af04025a6de';
export const covidLabTestEncType = 'a77d3e7f-5c8f-4074-a207-77a70e197b0c';

