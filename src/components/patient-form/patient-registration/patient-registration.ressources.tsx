import useSWR from 'swr';
import { openmrsFetch, useConfig, openmrsObservableFetch, getCurrentUser, navigate, useSession } from '@openmrs/esm-framework';
import { Patient, Relationships, PatientIdentifier, Person, Encounter, Concept, ObsFetchResponse, UsePatientPhotoResult, Address, relationshipType } from './patient-registration-types';
import { mergeMap } from 'rxjs/operators';
import { countryName, encounterTypeCheckIn, unknowLocation, uuidIdentifier, uuidPhoneNumber } from '../../constants';

const BASE_WS_API_URL = '/ws/rest/v1/';
const BASE_FHIR_API_URL = '/ws/fhir2/R4/';

function dataURItoFile(dataURI: string) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const buffer = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    buffer[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([buffer], { type: mimeString });
  return new File([blob], 'patient-photo.png');
}
export const getConceptAnswer = (concept, setQuestion) => {
  setQuestion(concept.display)
  return (concept.answers).map(answer => {
    return ({ uuid: answer.uuid, name: answer.display, display: answer.display })
  })
}

export function fetchRelationships(patientUuid) {
  if (patientUuid) {
    return openmrsFetch(`${BASE_WS_API_URL}relationship?v=full&person=${patientUuid}`, { method: 'GET' });
  }
  return Promise.resolve(null);
}

export async function fetchObsByPatientAndEncounterType(patientUuid: string,encounterType: string) {
  if (patientUuid && encounterType) {
    let observations = [];
    const encounter = await openmrsFetch(`${BASE_WS_API_URL}encounter?patient=${patientUuid}&encounterType=${encounterType}&v=default`, { method: 'GET' });
    let concepts = encounter.data.results[(encounter.data.results?.length)-1]?.obs;
    if(concepts){
      await Promise.all(concepts.map(async concept => {
        const obs = await getObs(concept.links[0]?.uri)
        observations.push({concept:obs?.data?.concept, answer:obs?.data?.value})
      }))
    }
    return observations;
  }
  return Promise.resolve(null);
}

export function fetchPatient(patientUuid) {
  if (patientUuid) {
    return openmrsFetch(`${BASE_WS_API_URL}patient/${patientUuid}?v=full`, { method: 'GET' });
  }
  return Promise.resolve(null);
}

export function savePatient(abortController: AbortController, patient: Patient, uuid?: string) {
  return openmrsFetch(`${BASE_WS_API_URL}patient/${uuid ? uuid : ''}`, {
    method: 'POST',
    body: patient,
    headers: { 'Content-Type': 'application/json' },
    signal: abortController.signal
  });
}
export async function saveAllRelationships(relationships: relationshipType[], patient, abortController: AbortController) {
  let persons = [];
  await relationships.map(relation => {
    persons.push({
      person: {
        uuid: relation.personUuid.trim().length == 0 ? null : relation.personUuid.trim(),
        names: [{ givenName: relation.givenName, familyName: relation.familyName }],
        gender: null,
        attributes: [{ attributeType: uuidPhoneNumber, value: relation.contactPhone, }]
      },
      type: relation.type,
      uuid: relation.relationUuid.trim().length == 0 ? null : relation.relationUuid.trim(),
    })
  })

  await Promise.all(persons.map(async person => {
    await savePerson(abortController, person.person, person.person.uuid).then(async (pers) => {
      const relation: Relationships = {
        relationshipType: person.type,
        personA: patient,
        personB: pers.data.uuid,
      };
      let relationshp;
      if (person.uuid == null) {
        relationshp = await saveRelationship(abortController, relation);
      }
      return relationshp;
    })
  }))
}

export function formatRelationship(values): relationshipType[] {
  if (values.length > 0) {
    return (values.map(value => {
      return {
        relationUuid: value?.uuid,
        personUuid: value?.personB?.uuid,
        givenName: value?.personB?.display.split(" ")[0],
        familyName: value?.personB?.display.split(" ")[1],
        contactPhone: value?.personB?.attributes[0]?.display.split(" = ")[1],
        type: value?.relationshipType?.uuid
      }
    }))
  }
  return [{ relationUuid: '', personUuid: '', givenName: '', familyName: '', contactPhone: '', type: '' }];
}

export async function saveAllConcepts(concepts: Concept[], person: string, abortController: AbortController) {
  const toDay = new Date().toISOString();
  saveEncounter({ patient: person, encounterDatetime: toDay, encounterType: encounterTypeCheckIn, location: unknowLocation }, abortController).then(async encounter => {
    await Promise.all(concepts.map(async concept => {
      await saveObs(person, toDay, encounter.data.uuid, concept.uuid, concept.answer, abortController)
    }))
  })
}

export function generateIdentifier(source: string, abortController: AbortController) {
  return openmrsFetch(`${BASE_WS_API_URL}idgen/identifiersource/${source}identifier`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: {
      generateIdentifiers: true,
      sourceUuid: source,
      numberToGenerate: 1
    },
    signal: abortController.signal,
  });
}

export async function saveEncounter(encounter: Encounter, abortController: AbortController) {
  return openmrsFetch(`${BASE_WS_API_URL}encounter`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: encounter,
    signal: abortController.signal,
  });
}

export function saveObs(person: string, obsDatetime: string, encounter: string, concept: string, value: string, abortController: AbortController) {
  return openmrsFetch(`${BASE_WS_API_URL}obs`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: {
      person: person,
      obsDatetime: obsDatetime,
      encounter: encounter,
      location: unknowLocation,
      concept: concept,
      value: value,
    },
    signal: abortController.signal,
  });
}


export function getObs(path: string) {
  return openmrsFetch(`${BASE_WS_API_URL+ path.split(BASE_WS_API_URL)[1] }`, { method: 'GET'});
}

export function deletePersonName(nameUuid: string, personUuid: string, abortController: AbortController) {
  return openmrsFetch(`${BASE_WS_API_URL}person/${personUuid}name/${nameUuid}`, {
    method: 'DELETE',
    signal: abortController.signal,
  });
}

export function saveRelationship(abortController: AbortController, relationship: Relationships) {
  return openmrsFetch(`${BASE_WS_API_URL}relationship`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: relationship,
    signal: abortController.signal,
  });
}


export function updateRelationship(
  abortController: AbortController,
  relationshipUuid,
  relationship: { relationshipType: string },
) {
  return openmrsFetch(`${BASE_WS_API_URL}relationship/${relationshipUuid}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: { relationshipType: relationship.relationshipType },
    signal: abortController.signal,
  });
}

export function deleteRelationship(abortController: AbortController, relationshipUuid) {
  return openmrsFetch(`${BASE_WS_API_URL}relationship/${relationshipUuid}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
    signal: abortController.signal,
  });
}

export async function fetchAllLocation() {
  const url = `/module/addresshierarchy/ajax/getChildAddressHierarchyEntries.form?searchString=${countryName}`;

  try {
    const statesData = await openmrsFetch(url, { method: 'GET' });
    let states = await statesData
    const cityVillages = async (state) => (openmrsFetch(`${url}%7C${state}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }));
    let places: Address[] = [];
    let placesTables;
    let locs: Address[] = [];
    placesTables = await Promise.all(
      states.data.map(async state => {
        let cities = await cityVillages(state.name)
        locs = await Promise.all(cities.data.map((city) => ({ country: countryName, stateProvince: state.name, cityVillage: city.name, display: `${city.name}, ${state.name}` })))
        return locs;
      })
    )
    await Promise.all(placesTables.map(async (tables) => tables.map(t => places.push(t))))
    return places
  } catch (error) { }
}

export async function fetchConceptByUuid(conceptUuid: string, lang: string) {
  return openmrsFetch(`${BASE_WS_API_URL}concept/${conceptUuid}?v=full&lang=${lang}`, {
    method: "GET",
  });
}
export function getSynchronizedCurrentUser(opts: any) {
  return getCurrentUser(opts).pipe(
    mergeMap(async user => {
      return user;
    }),
  );
}
export function formAddres(address): Address {
  if (address) {
    if (typeof address === "string")
      return { country: countryName, stateProvince: address.split(", ")[1], cityVillage: address.split(", ")[0], address1: "", display: address }
    else
      return { country: address.country, stateProvince: address.stateProvince, cityVillage: address.cityVillage, address1: address.address1, display: address.cityVillage + " ," + address.stateProvince }
  }
  else {
    return null;
  }
}
export async function savePatientPhoto(
  patientUuid: string,
  content: string,
  url: string,
  date: string,
  conceptUuid: string,
  abortController: AbortController,
) {
  const formData = new FormData();
  formData.append('patient', patientUuid);
  formData.append('file', dataURItoFile(content));
  formData.append(
    'json',
    JSON.stringify({
      person: patientUuid,
      concept: conceptUuid,
      groupMembers: [],
      obsDatetime: date,
    }),
  );

  return openmrsFetch(url, {
    method: 'POST',
    signal: abortController.signal,
    body: formData,
  });
}


export function usePatientPhoto(patientUuid: string): UsePatientPhotoResult {
  const {
    concepts: { patientPhotoUuid },
  } = useConfig();
  const url = `${BASE_WS_API_URL}obs?patient=${patientUuid}&concept=${patientPhotoUuid}&v=full`;

  const { data, error } = useSWR<{ data: ObsFetchResponse }, Error>(patientUuid ? url : null, openmrsFetch);

  const item = data?.data?.results[0];

  return {
    data: item
      ? {
        dateTime: item?.obsDatetime,
        imageSrc: item?.value?.links?.uri,
      }
      : null,
    isError: error,
    isLoading: !data && !error,
  };
}

export async function fetchPerson(query: string, abortController: AbortController) {
  return openmrsFetch(`${BASE_WS_API_URL}person?q=${query}`, {
    signal: abortController.signal,
  });
}

export async function addPatientIdentifier(
  patientUuid: string,
  patientIdentifier: PatientIdentifier,
  abortController: AbortController,
) {
  return openmrsFetch(`${BASE_WS_API_URL}patient/${patientUuid}identifier/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: patientIdentifier,
  });
}

export async function updatePatientIdentifier(
  patientUuid: string,
  identifierUuid: string,
  identifier: string,
  abortController: AbortController,
) {
  return openmrsFetch(`${BASE_WS_API_URL}patient/${patientUuid}identifier/${identifierUuid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: { identifier },
  });
}

export async function deletePatientIdentifier(
  patientUuid: string,
  patientIdentifierUuid: string,
  abortController: AbortController,
) {
  return openmrsFetch(`${BASE_WS_API_URL}patient/${patientUuid}identifier/${patientIdentifierUuid}?purge`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
  });
}

export async function deletePatient(
  patientUuid: string,
  abortController: AbortController,
) {
  return openmrsFetch(`${BASE_WS_API_URL}patient/${patientUuid}?purge=true`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
  });
}
export function savePerson(abortController: AbortController, person: Person, uuid?: string) {
  return openmrsFetch(`/ws/rest/v1/person/${uuid ? uuid : ''}`, {
    method: 'POST',
    body: person,
    headers: { 'Content-Type': 'application/json' },
    signal: abortController.signal
  });
}

export function deletePerson(abortController: AbortController, uuid: string) {
  return openmrsFetch(`/ws/rest/v1/person/${uuid}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    signal: abortController.signal
  });
}


export async function fetchRelationshipType() {
  return openmrsFetch(`${BASE_WS_API_URL}relationshiptype`, {
    method: "GET",
  });
}