import { useEffect, useReducer } from "react";
import { PatientUuid } from "@openmrs/esm-api";
import { fetchObsByPatientAndEncounterType, fetchPatient, fetchRelationships } from "./patient-registration.ressources";
import { Relationships } from "./patient-registration-types";
import { encounterTypeCheckIn } from "../../constants";
export type NullablePatient = fhir.Patient | null;

interface CurrentPatientState {
  patientUuid: string | null;
  patient: any;
  relationships: any;
  obs: any
  isPendingUuid: boolean;
  isLoadingPatient: boolean;
  err: Error | null;
}

interface LoadPatient {
  type: ActionTypes.loadPatient;
  patientUuid: string | null;
}

interface NewPatient {
  type: ActionTypes.newPatient;
  patient: NullablePatient;
  relationships: Relationships[];
  obs: any[]
}

interface PatientLoadError {
  type: ActionTypes.loadError;
  err: Error | null;
}

type Action = LoadPatient | NewPatient | PatientLoadError;

enum ActionTypes {
  loadPatient = "loadPatient",
  newPatient = "newPatient",
  loadError = "patientLoadError",
}

const initialState: CurrentPatientState = {
  patientUuid: null,
  patient: null,
  relationships: null,
  obs: null,
  isPendingUuid: true,
  isLoadingPatient: false,
  err: null,
};


function getPatientUuidFromUrl(): PatientUuid {
  const match = /\/patient\/([a-zA-Z0-9\-]+)\/?/.exec(location.pathname);
  return match && match[1];
}

function reducer(
  state: CurrentPatientState,
  action: Action
): CurrentPatientState {
  switch (action.type) {
    case ActionTypes.loadPatient:
      return {
        ...state,
        patientUuid: action.patientUuid,
        patient: null,
        relationships: null,
        obs: null,
        isPendingUuid: false,
        isLoadingPatient: true,
        err: null,
      };
    case ActionTypes.newPatient:
      return {
        ...state,
        patient: action.patient,
        relationships: action.relationships,
        obs: action.obs,
        isPendingUuid: false,
        isLoadingPatient: false,
        err: null,
      };
    case ActionTypes.loadError:
      return {
        ...state,
        patient: null,
        isPendingUuid: false,
        isLoadingPatient: false,
        err: action.err,
      };
    default:
      return state;
  }
}

export function usePatient(patientUuid?: string) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    patientUuid: patientUuid ?? null,
    isPendingUuid: !patientUuid,
    isLoadingPatient: !!patientUuid,
  });

  useEffect(() => {
    if (state.isPendingUuid) {
      const patientUuidFromUrl = getPatientUuidFromUrl();
      if (patientUuidFromUrl) {
        dispatch({
          type: ActionTypes.loadPatient,
          patientUuid: patientUuidFromUrl,
        });
      } else {
        dispatch({ type: ActionTypes.newPatient, patient: null, relationships: null, obs: null });
      }
    }

    let active = true;
    if (state.isLoadingPatient && state.patientUuid) {


      fetchPatient(state.patientUuid).then(
        async (data) => {
          const relationships = await fetchRelationships(data.data.uuid);
          const obs = await fetchObsByPatientAndEncounterType(data.data.uuid, encounterTypeCheckIn);
          active &&
            dispatch({
              patient: data,
              relationships: relationships,
              obs: obs,
              type: ActionTypes.newPatient,
            })
        },
        (err) =>
          active &&
          dispatch({
            err,
            type: ActionTypes.loadError,
          })
      );


    }
    return () => {
      active = false;
    };
  }, [state.isPendingUuid, state.isLoadingPatient, state.patientUuid]);

  useEffect(() => {
    const handleRouteUpdate = (evt) => {
      const newPatientUuid = getPatientUuidFromUrl();
      if (newPatientUuid != state.patientUuid) {
        dispatch({
          type: ActionTypes.loadPatient,
          patientUuid: newPatientUuid,
        });
      }
    };
    window.addEventListener("single-spa:routing-event", handleRouteUpdate);
    return () =>
      window.removeEventListener("single-spa:routing-event", handleRouteUpdate);
  }, [state.patientUuid]);
  return {
    isLoading: state.isPendingUuid || state.isLoadingPatient,
    patient: state.patient,
    relationships: state.relationships,
    obs: state.obs,
    patientUuid: patientUuid ?? state.patientUuid,
    error: state.err,
  };
}

