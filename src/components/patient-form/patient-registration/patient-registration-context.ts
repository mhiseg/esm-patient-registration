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

export interface PatientRegistrationContextProps {
  setFieldValue(field: string, value: any, shouldValidate?: boolean): void;
  // validate?: boolean=
}

export const PatientRegistrationContext = createContext<PatientRegistrationContextProps | undefined>(undefined);