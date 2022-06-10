import React from 'react';
import { AddressField } from './field/address/address-field.component';
import BirthPlace from './field/birthplace/birthPlace';
import { DobField } from './field/dob/dob.component';
import { GenderField } from './field/gender/gender-field.component';
import { HabitatField } from './field/habitat/habitat-field.component';
import { IdField } from './field/id/id-field.component';
import { IdSelect } from './field/id/identifier-selection-overlay';
import { GivenNameField } from './field/name/givenname-field.component';
import { FamilyNameField } from './field/name/familyname-field.component';
import { OccupationSelect } from './field/occupation/occuptation-field-component';
import { PhoneField } from './field/phone/phone-field.component'
import ResidenceField from './field/residence/residence';
import { StatuField } from './field/status/status-selection-overlay';
import { Unknow } from './input/custom-input/unknow-format-component';

const FieldForm = (name: string, value?) => {
  switch (name) {  
    case 'givenName':
      return <GivenNameField  name={name} className={true} />;
    case 'familyName':
      return <FamilyNameField name={name} className={true} />;
    case 'idType':
      return <IdSelect />;
    case 'idValue':
      return <IdField />;
    case 'gender':
      return <GenderField />;
    case 'habitat':
      return <HabitatField />;
    case 'statu':
      return <StatuField />;
    case 'occupation':
      return <OccupationSelect />;
    case 'phone':
      return <PhoneField name={name} value={value} />;;
    case 'address':
      return <AddressField />;
    case 'residence':
      return <ResidenceField />;
    case 'birthPlace':
      return <BirthPlace />;
    case 'dob':
      return <DobField birthdate={value.birthdate} age={value.age} months={value.months} birthdateEstimated={value.birthdateEstimated} />;
    default:
      return <Unknow />;
  }
}

export default FieldForm;
