import * as Yup from 'yup';

export const validationSchema = Yup.object({
  typeIdentifiant: Yup.string(),
  firstName: Yup.string().required("Le prenom ne peut pas etre vide"),
  dob: Yup.date(),
  status: Yup.string(),
  gender: Yup.string().required("Le patient doit avoir un genre"),
  birthPlace: Yup.string(),
  identifiers: Yup.number(),
  familyName: Yup.string().required("Le nom ne peut pas etre vide"),
  metier: Yup.string(),
  residence: Yup.string(),
  adress: Yup.string(),
  phone: Yup.string(),
  habitat: Yup.string(),
  relationships: Yup.array(
      Yup.object().shape({
          prenomRefValue: Yup.boolean(),
          nomRefValue: Yup.boolean(),
          telRefValue: Yup.boolean(),
          prenomRef: Yup.string().when('prenomRefValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') }),
          nomRef: Yup.string().when('nomRefValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') }),
          telRef: Yup.string().when('telRefValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') })
      })
  )
});


