import { Dispatch, useState } from "react";
import { FormValues } from "./patient-registration-context";

export function useInitialFormValues(): [FormValues, Dispatch<FormValues>] {
  const [initialV, setInitiatV] = useState<FormValues>({
    relationships: [],
    typeIdentifiant: '',
    firstName: '',
    dob: null,
    status: '',
    gender: '',
    birthPlace: '',
    identifiers: null,
    familyName: '',
    metier: '',
    residence: '',
    adress: '',
    phone: '',
    habitat: '',
  });

  return [initialV, setInitiatV];
}
