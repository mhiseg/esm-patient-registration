import { createContext, SetStateAction, useContext } from 'react';

export interface FormValues {
  relationships: Array<any>,
  typeIdentifiant: string,
  firstName: string,
  dob: Date,
  status: string,
  gender: string,
  birthPlace: string,
  identifiers: number,
  familyName: string,
  metier: string,
  residence: string,
  adress: string,
  phone: string,
  habitat: string,
}

export interface state{
  givennameState:boolean;
  familyNameState: boolean;
  relationTypeState: boolean;
  phoneTypeState: boolean;
}

export interface PatientRegistrationContextProps {
  setFieldValue(field: string, value: any, shouldValidate?: boolean): void;
  state: Array<state>
  // values: FormValues
  // validationSchema: any;
}

export const PatientRegistrationContext = createContext<PatientRegistrationContextProps | undefined>(undefined);