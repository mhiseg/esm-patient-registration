export const basePath = '${openmrsSpaBase}/patient/';
export const encounterRepresentation =
  'custom:(uuid,encounterDatetime,encounterType,location:(uuid,name),' +
  'patient:(uuid,display),encounterProviders:(uuid,provider:(uuid,name)),' +
  'obs:(uuid,obsDatetime,voided,groupMembers,concept:(uuid,name:(uuid,name)),value:(uuid,name:(uuid,name),' +
  'names:(uuid,conceptNameType,name))))';

// registration concept
export const maritalStatusConcept = '1054AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const occupationConcept = '1542AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'

// Encounter types
export const htsRetrospectiveEncounterType = '79c1f50f-f77d-42e2-ad2a-d29304dde2fe';
export const covidCaseAssessmentEncType = '253a43d3-c99e-415c-8b78-ee7d4d3c1d54';
export const covidVaccinationEncType = '5b37ce7a-c55e-4226-bdc8-5af04025a6de';
export const covidLabTestEncType = 'a77d3e7f-5c8f-4074-a207-77a70e197b0c';

