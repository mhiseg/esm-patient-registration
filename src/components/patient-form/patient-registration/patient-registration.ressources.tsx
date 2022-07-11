import { openmrsFetch, getCurrentUser } from '@openmrs/esm-framework';
import { Patient, Relationships, PatientIdentifier, Person, Encounter, Concept, Address, relationshipType, Obs } from './patient-registration-types';
import { mergeMap } from 'rxjs/operators';
import { countryName, encounterTypeCheckIn, unknowLocation, uuidPhoneNumber } from '../../constants';
const BASE_WS_API_URL = '/ws/rest/v1/';


export const getConceptAnswer = (concept, setQuestion): Concept[] => {
  setQuestion(concept.display)
  return (concept.answers).map(answer => {
    return ({ uuid: answer.uuid, name: answer.display, display: answer.display })
  })
}

export async function fetchRelationships(patientUuid: string) {
  const relationships = await openmrsFetch(`${BASE_WS_API_URL}relationship?person=${patientUuid}&v=full`, { method: 'GET' });
  return Promise.all(relationships?.data?.results.map(async relationship => {
    const person = await fetchPerson(relationship.personB.preferredName.links[0].uri.split("person")[1]);
    const relation: relationshipType = {
      relationUuid: relationship?.uuid,
      givenName: person.data.givenName,
      familyName: person.data.familyName,
      contactPhone: relationship.personB?.attributes[0]?.display.split(" = ")[1],
      type: relationship?.relationshipType?.uuid,
      personUuid: relationship.personB?.uuid,
    }
    return relation;
  }))
}

export async function fetchObsByPatientAndEncounterType(patientUuid: string, encounterType: string) {
  if (patientUuid && encounterType) {
    let observations: Obs[] = [];
    const encounter = await openmrsFetch(`${BASE_WS_API_URL}encounter?patient=${patientUuid}&encounterType=${encounterType}&v=default&limit=1`, { method: 'GET' });
    let concepts = encounter?.data?.results[0]?.obs;
    if (concepts && concepts.length > 0) {
      await Promise.all(concepts.map(async concept => {
        const obs = await (await getObs(concept.links[0]?.uri))?.data
        observations.push({
          uuid: obs.uuid,
          encounter: obs.encounter.uuid,
          concept: obs.concept.uuid,
          value: obs.value.uuid
        })
      }))
    } else {
      observations.push({ encounter: encounter?.data?.results[0]?.uuid });
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
  if (uuid && patient.identifiers.length > 1)
    EditPatientIdentifier(abortController, uuid, patient.identifiers[1].uuid, patient.identifiers[1])
  return openmrsFetch(`${BASE_WS_API_URL}patient/${uuid ? uuid : ''}`, {
    method: 'POST',
    body: patient,
    headers: { 'Content-Type': 'application/json' },
    signal: abortController.signal
  });
}

export async function EditPatientIdentifier(abortController: AbortController, patientUuid: string, uuid: string, identifier: PatientIdentifier) {
  await openmrsFetch(`${BASE_WS_API_URL}patient/${patientUuid}/identifier/${uuid == null ? "" : uuid}`, {
    method: 'POST',
    body: identifier,
    headers: { 'Content-Type': 'application/json' },
    signal: abortController.signal
  });
}


export async function saveAllRelationships(relationships: relationshipType[], patient, abortController: AbortController) {
  let persons = [];
  await relationships.map(relation => {
    persons.push({
      person: {
        uuid: relation.personUuid ? relation.personUuid : null,
        names: [{ givenName: relation.givenName, familyName: relation.familyName }],
        gender: null,
        attributes: [{ attributeType: uuidPhoneNumber, value: relation.contactPhone }]
      },
      type: relation.type,
      uuid: relation.relationUuid ? relation.relationUuid : null,
    })
  })

  await Promise.all(persons.map(async person => {
    if (person.person.names[0].givenName) {
      await savePerson(abortController, person.person, person.person.uuid).then(async (pers) => {
        const relation: Relationships = {
          relationshipType: person.type,
          personA: patient,
          personB: pers.data.uuid,
          uuid: person?.uuid,
        };
        await saveRelationship(abortController, relation, relation.uuid);
      })
    } else if (person.uuid) {
      await deleteRelationship(abortController, person.uuid, person.person.uui)
    }
  }))
}

export function formatRelationship(values): relationshipType[] {
  if (values?.length > 0) {
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

export async function saveAllConcepts(obs: Obs[], person: string, abortController: AbortController, encounterUuid?: string) {
  const toDay = new Date().toISOString();
  const concepts = obs.filter(o => o.value !== undefined);
  const encounter = encounterUuid ? encounterUuid : await (await saveEncounter(encounterUuid ? { encounterDatetime: toDay } : { patient: person, encounterDatetime: toDay, encounterType: encounterTypeCheckIn, location: unknowLocation }, abortController, encounterUuid)).data.uuid;
  if (concepts.length > 0) {
    await Promise.all(concepts.map(async concept => {
      const obs = await saveObs(person, toDay, encounter, concept.concept, concept.value, abortController, concept.uuid)
    }))
  }
}

export function getPatient(query) {
  return openmrsFetch(
    `${BASE_WS_API_URL}patient?v=full&q=${query}`,
    {
      method: "GET",
    }
  );
}
export function generateIdentifier(source: string, abortController: AbortController) {
  return openmrsFetch(`${BASE_WS_API_URL}idgen/identifiersource/${source}/identifier`, {
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

export async function saveEncounter(encounter: Encounter | any, abortController: AbortController, uuid?: string) {
  return openmrsFetch(`${BASE_WS_API_URL}encounter/${uuid ? uuid : ""}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: encounter,
    signal: abortController.signal,
  });
}

export async function saveObs(person: string, obsDatetime: string, encounter: string, concept: string, value: string, abortController: AbortController, uuid?: string) {
  if (uuid)
    return editObs(uuid, value, abortController);
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
function editObs(uuid: string, value: string, abortController: AbortController) {
  return openmrsFetch(`${BASE_WS_API_URL}obs/${uuid}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { value: value },
    signal: abortController.signal,
  });
}

function deleteObs(uuid: string) {
  return openmrsFetch(`${BASE_WS_API_URL}obs/${uuid}?purge=true`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
}

export function getObs(path: string) {
  return openmrsFetch(`${BASE_WS_API_URL + path.split(BASE_WS_API_URL)[1]}`, { method: 'GET' });
}

export function deletePersonName(nameUuid: string, personUuid: string, abortController: AbortController) {
  return openmrsFetch(`${BASE_WS_API_URL}person/${personUuid}name/${nameUuid}`, {
    method: 'DELETE',
    signal: abortController.signal,
  });
}

export function saveRelationship(abortController: AbortController, relationship: Relationships, uuid?: string) {
  if (uuid && uuid !== null) {
    return openmrsFetch(`${BASE_WS_API_URL}relationship/${uuid}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: { relationshipType: relationship.relationshipType },
      signal: abortController.signal,
    });
  }
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

export async function deleteRelationship(abortController: AbortController, relationshipUuid, personUuid: string) {
  return openmrsFetch(`${BASE_WS_API_URL}relationship/${relationshipUuid}`, {
    method: 'DELETE'
  }).then(async res => {
    await deletePerson(abortController, personUuid)
    return Promise.resolve(true)
  })
    .catch(error => Promise.resolve(false))
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


export async function fetchPerson(uri: string, query?: string) {
  const url = `${BASE_WS_API_URL}person${uri ? uri : '?q=' + query}`
  return openmrsFetch(url, { method: 'GET' });
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

export function savePerson(abortController: AbortController, person: Person, uuid?: string) {
  if (uuid) {
    EditPersonName(abortController, person, uuid);
  }
  return openmrsFetch(`${BASE_WS_API_URL}person/${uuid ? uuid : ''}`, {
    method: 'POST',
    body: person,
    headers: { 'Content-Type': 'application/json' },
    signal: abortController.signal
  });
}


export function EditPersonName(abortController: AbortController, person: Person, uuid: string) {
  return openmrsFetch(`${BASE_WS_API_URL}person/${uuid}/name`, {
    method: 'POST',
    body: {
      "givenName": person.names[0].givenName,
      "familyName": person.names[0].familyName,
      "preferred": true
    },
    headers: { 'Content-Type': 'application/json' },
    signal: abortController.signal
  });
}

export function deletePerson(abortController: AbortController, uuid: string) {
  return openmrsFetch(`${BASE_WS_API_URL}person/${uuid}?purge=true`, {
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