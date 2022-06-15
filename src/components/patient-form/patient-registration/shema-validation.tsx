   
   import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
   const { t } = useTranslation();

   export const patientSchema = Yup.object().shape({
        identifierType: Yup.string(),
        givenName: Yup.string()
          .required(t("messageErrorGiveName", "Give name can't null")),
        dob: Yup.object(),
        status: Yup.string(),
        gender: Yup.string().required(t("messageErrorGender", "Gender is required")),
        birthPlace: Yup.object(),
        identifier: Yup.number(),
        familyName: Yup.string().required(t("messageErrorFamilyName", "Family Name is required")),
        occupation: Yup.string(),
        residence: Yup.object(),
        adress: Yup.string(),
        phone: Yup.string().test(
            (value)=>{
                console.log(value?.length,'-==-=-=-');
                return value? value.length ==7 : false;
            }
        ),
        habitat: Yup.string(),
        relationships: Yup.array(
            Yup.object({
                givenNameValue: Yup.boolean(),
                familyNameValue: Yup.boolean(),
                phoneValue: Yup.boolean(),
                uuidValue: Yup.boolean(),
                givenName: Yup.string().when('givenNameValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') }),
                familyName: Yup.string().when('familyNameValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') }),
                contactPhone: Yup.string().when('phoneValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') }),
                uuid: Yup.string().when('uuidValue', { is: true, then: Yup.string().required('Veuillez renseigner tous les champs de reference du patient') })
            })
        )
    });