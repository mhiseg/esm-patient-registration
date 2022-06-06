import { openmrsFetch } from "@openmrs/esm-framework";



export function fetchIdentifierType() {
   return openmrsFetch(`/ws/rest/v1/patientidentifiertype?v=default`, { method: 'GET' });
}
